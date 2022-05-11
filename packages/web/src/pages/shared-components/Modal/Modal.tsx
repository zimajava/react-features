import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import MaterialModal from '@mui/material/Modal';
import { useSpring, animated } from '@react-spring/web';

interface FadeProps {
  children?: React.ReactElement<any>;
  in: boolean;
  onEnter?: () => void;
  onExited?: () => void;
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>((props, ref) => {
  const { in: open, children, onEnter, onExited, ...other } = props;

  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactElement<any>;
};

export function Modal({ open, onClose, children }: ModalProps) {
  return (
    <MaterialModal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box sx={style}>{children}</Box>
      </Fade>
    </MaterialModal>
  );
}
