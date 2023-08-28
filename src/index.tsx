import { Injector, Logger, common, settings } from "replugged";

type Settings = {
  service?: string;
};

const defaultSettings = {
  service: "https://letmegpt.com/?q=%s",
} satisfies Partial<Settings>;

const cfg = await settings.init<Settings, keyof typeof defaultSettings>("LMGPTTFY", defaultSettings);

const injector = new Injector();
const logger = Logger.plugin("LMGPTTFY");

export function start(): void {
  logger.log("LMGPTTFY has started!");
  injectSendMessage();
}

function injectSendMessage(): void {
  injector.before(common.messages, "sendMessage", (args) => {
    if (!args[1].content.startsWith("!lmgpttfy ")) return args;
    const searchString = args[1].content.replace("!lmgpttfy ", "");
    const service = cfg.get("service");
    const link = service.replace("%s", encodeURIComponent(searchString));
    args[1].content = link;
    return args;
  });
}

export function stop(): void {
  injector.uninjectAll();
}
