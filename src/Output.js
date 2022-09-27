// import React, { useContext, useState } from 'react';
import {
  // Button,
  // Box,
  // Header,
  // Heading,
  // Layer,
  // ResponsiveContext,
  TextArea,
} from 'grommet';
// import { FormClose } from 'grommet-icons';

export const Output = (props) => {
  // const [open, setOpen] = useState(true);
  // const size = useContext(ResponsiveContext);
  // const onClose = () => setOpen(undefined);
  return (
    <>
      {/* {open && (
        <Layer
          position="right"
          full={!['xsmall', 'small'].includes(size) ? 'vertical' : true}
          modal
          onClickOutside={onClose}
          onEsc={onClose}
        >
          <Box
            fill="vertical"
            overflow="auto"
            width={!['xsmall', 'small'].includes(size) ? 'medium' : undefined}
            pad="medium"
          >
            <Header>
              <Heading level={2} margin="none">
                This is a Layer.
              </Heading>
              <Button
                a11yTitle={`You are on a Close button in a layer containing
                a text description. To close the layer 
                and return to the primary content, press Enter.`}
                autoFocus
                icon={<FormClose />}
                onClick={onClose}
              />
            </Header> */}
            {/* <Box pad={{ vertical: 'medium' }}> */}
                <TextArea
                  readOnly
                  fill
                  rows={12}
                  resize
                  value={ props.output?.join('\n') }
                  size='xsmall'
                  plain
                  style={{ whiteSpace: 'pre', fontFamily: 'Consolas,Courier New,monospace', fontSize: 'small' }}
                />
            {/* </Box> */}
          {/* </Box>
        </Layer>
      )} */}
    </>
  );
};

export default Output;