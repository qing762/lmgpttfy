import { Injector, Logger, common } from "replugged";

const injector = new Injector();
const logger = Logger.plugin("LMGTFY");

export function start(): void {
  logger.log("hewwo from lmgtfy - developed with ♡ in sweden");
  injectSendMessage();
}

function injectSendMessage(): void {
  injector.instead(common.messages, "sendMessage", async (args, fn) => {
    if (!args[1].content.startsWith("!lmgtfy ")) return fn(...args);
    const searchString = args[1].content.replace("!lmgtfy ", "");
    const link = `https://letmegooglethat.com/?q=${searchString.replace(/ /g, "+")}`;
    args[1].content = link;
    return fn(...args);
  });
}

export function stop(): void {
  injector.uninjectAll();
}
