import { Injector, Logger, common } from "replugged";

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
    const link = `https://letmegooglethat.com/?q=${encodeURIComponent(searchString)}`;
    args[1].content = link;
    return args;
  });
}

export function stop(): void {
  injector.uninjectAll();
}
