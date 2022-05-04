import React from 'react';
import clsx from 'clsx';
import { useLocation, useHistory } from 'react-router-dom';
// eslint-disable-next-line @emotion/no-vanilla
import { css } from '@emotion/css';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import { ViewTypeEnum } from '../ViewType.enum';

const rippleStyle = css`
  position: absolute;
  background: #fff;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  animation: ripples 0.6s linear infinite;

  @keyframes ripples {
    0% {
      width: 0;
      height: 0;
      opacity: 0.5;
    }
    100% {
      width: 500px;
      height: 500px;
      opacity: 0;
    }
  }
`;

const buttonStyle = css`
  position: relative;
  margin: 0 5px;
  padding: 10px;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid lightgray;
  cursor: pointer;

  &:first-child {
    margin-left: 0;
    background: linear-gradient(-90deg, #f5ce62, #e85a19);
  }
  &:last-child {
    margin-right: 0;
    background: linear-gradient(90deg, #0162c8, #55e7fc);
  }
  &:hover {
    filter: brightness(105%);
  }
`;

const active = css`
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), inset 3px 3px 4px rgba(0, 0, 0, 0.25);
`;

function clickListener(event: React.MouseEvent<HTMLButtonElement>) {
  // const x = event.clientX - event.currentTarget.offsetLeft;
  // const y = event.clientY - event.currentTarget.offsetTop;

  const ripple = document.createElement('span');
  ripple.setAttribute('class', rippleStyle);
  // ripple.style.left = `${x}px`;
  // ripple.style.top = `${y}px`;

  event.currentTarget.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

type Props = { type: ViewTypeEnum; changeType: (type: ViewTypeEnum) => void };

export function ListToggle({ type, changeType }: Props) {
  return (
    <div
      className={css`
        padding: 15px;
        border: 1px solid lightgray;
        margin-bottom: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
      `}
    >
      <button
        className={clsx(buttonStyle, [{ [active]: type === ViewTypeEnum.gallery }])}
        type="button"
        onClick={(event) => {
          if (type !== ViewTypeEnum.gallery) {
            changeType(ViewTypeEnum.gallery);
            clickListener(event);
          }
        }}
      >
        <AppsRoundedIcon />
      </button>
      <button
        className={clsx(buttonStyle, [{ [active]: type === ViewTypeEnum.list }])}
        type="button"
        onClick={(event) => {
          if (type !== ViewTypeEnum.list) {
            changeType(ViewTypeEnum.list);
            clickListener(event);
          }
        }}
      >
        <FormatListBulletedRoundedIcon />
      </button>
    </div>
  );
}
