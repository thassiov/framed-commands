import React from "react";
import { CommandData } from "../ui/views/main/Main";

type Dispatcher = React.Dispatch<React.SetStateAction<CommandData | undefined>>;

class CommandDataObserver {
  private subscribers: Dispatcher[];

  constructor() {
    this.subscribers = [];
  }

  public notify(commandData?: CommandData): void {
    this.subscribers.forEach(fn => fn(commandData));
  }

  public subscribe(subscriber: Dispatcher): void {
    this.subscribers.push(subscriber);
  }

  public unsubscribe(subscriber: Dispatcher): void {
    this.subscribers = this.subscribers.filter(fn => fn !== subscriber);
  }
}

export default CommandDataObserver;
