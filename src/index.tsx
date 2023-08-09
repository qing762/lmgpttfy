import { Injector, Logger, common, components, settings, util } from "replugged";
const { RadioItem } = components;

type Settings = {
  service: string;
};

const defaultSettings = {
  service: "https://letmegooglethat.com",
} satisfies Partial<Settings>;

const cfg = await settings.init<Settings, keyof typeof defaultSettings>("LMGTFY", defaultSettings);

const injector = new Injector();
const logger = Logger.plugin("LMGTFY");

export function start(): void {
  logger.log("hewwo from lmgtfy - developed with ♡ in sweden");
  injectSendMessage();
}

function injectSendMessage(): void {
  injector.before(common.messages, "sendMessage", (args) => {
    if (!args[1].content.startsWith("!lmgtfy ")) return args;
    const searchString = args[1].content.replace("!lmgtfy ", "");
    const service = cfg.get("service", "https://letmegooglethat.com/?q=%s");
    const link = service.replace("%s", encodeURIComponent(searchString));
    args[1].content = link;
    return args;
  });
}

export function Settings(): React.ReactElement {
  const { onChange, value } = util.useSetting(cfg, "service", "https://letmegooglethat.com/q=%s");
  return (
    <RadioItem
      value={value}
      options={[
        {
          name: "letmegooglethat.com",
          value: "https://letmegooglethat.com/?q=%s",
        },
        {
          name: "lmgtfy.app",
          value: "https://lmgtfy.app/?q=%s",
        },
        {
          name: "lmgtfy.app (internet explainer)",
          value: "https://lmgtfy.app/?q=%s&iie=1",
        },
        {
          name: "lmgtfy.app (images & internet explainer)",
          value: "https://lmgtfy.app/?q=%s&t=i&iie=1",
        },
        {
          name: "lmgtfy.app (images)",
          value: "https://lmgtfy.app/?q=%s&t=i",
        },
        {
          name: "gogolethatforyou.com",
          value: "https://googlethatforyou.com?q=%s",
        },
      ]}
      onChange={(option) => {
        onChange(option.value);
        cfg.set("service", option.value);
        logger.log(`changed lmgtfy service to ${option.value}`);
      }}>
      Which service do you want to use?
    </RadioItem>
  );
}

export function stop(): void {
  injector.uninjectAll();
}
