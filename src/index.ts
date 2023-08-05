import { Injector, Logger } from "replugged";

const inject = new Injector();
const logger = Logger.plugin("LMGTFY");

export function start(): void {
  logger.log("hewwo");
}

export function stop(): void {
  inject.uninjectAll();
}
