import {Box} from "ink";
import React, {FC} from "react";
import {ICommandDescriptor} from "../../../definitions/ICommandDescriptor";
import CommandDetails from "../../components/command-details";

type DetailsProps = {
  commandDescriptor: ICommandDescriptor;
}

const Details: FC<DetailsProps> = ({ commandDescriptor }: DetailsProps) => {
  return (
    <Box
     width={'100%'}
     borderStyle={'round'}
     borderColor={'white'}
     flexDirection={'column'}
     alignSelf={'flex-start'}
     paddingX={1}>
      <CommandDetails commandDescriptor={commandDescriptor} />
    </Box>
    );
};

export default Details;
