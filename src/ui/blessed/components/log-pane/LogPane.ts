import {log, Widgets} from "blessed";

function LogPane(): Widgets.Log {
  const logPane = log({
    label: 'Logs',
    border: {
      type: 'line',
      fg: 3
    },
  });

  return logPane;
}

export default LogPane;
