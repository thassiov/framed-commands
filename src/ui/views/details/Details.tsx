import { Box } from "ink";
import React, { FC, useEffect, useState } from "react";
import { ICommandDescriptor } from "../../../definitions/ICommandDescriptor";
import CommandDetails from "../../components/command-details";
import { CommandData } from "../main/Main";

type Dispatcher = React.Dispatch<React.SetStateAction<CommandData | undefined>>;

type DetailsProps = {
  commandDataSubscriber: (dispatcher: Dispatcher) => void;
}

const Details: FC<DetailsProps> = ({ commandDataSubscriber }: DetailsProps) => {
  const [commandData, setCommandData] = useState<CommandData | undefined>(undefined);

  useEffect(() => {
    commandDataSubscriber(setCommandData);
  });

  return (
    <Box
     width={'100%'}
     borderStyle={'round'}
     borderColor={'white'}
     flexDirection={'column'}
     alignSelf={'flex-start'}
     paddingX={1}>
      <CommandDetails commandDescriptor={commandData?.command as ICommandDescriptor} />
    </Box>
    );
};

export default Details;
