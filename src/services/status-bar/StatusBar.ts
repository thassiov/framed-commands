import React  from 'react';
import EmptyReactFragment from '../../utils/EmptyReactFragment';

export default class StatusBar {
  constructor(private _setComponent: React.Dispatch<React.ReactElement>) {}

  public setComponent(component: React.ReactElement): void {
    this._setComponent(component);
  }
  public unsetComponent(): void {
    this._setComponent(EmptyReactFragment());
  }
}
