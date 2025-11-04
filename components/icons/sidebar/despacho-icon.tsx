import React from 'react';
import {Svg} from '../../styles/svg';

export const DespachoIcon = () => {
   return (
      <Svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         css={{
            '& path': {
               fill: 'currentColor',
            },
         }}
      >
         <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8C2 6.9 2.9 6 4 6H6V4C6 2.9 6.9 2 8 2H16C17.1 2 18 2.9 18 4V6ZM8 4V6H16V4H8ZM4 8V18H20V8H4ZM7 10C7.55 10 8 10.45 8 11S7.55 12 7 12 6 11.55 6 11 6.45 10 7 10ZM17 10C17.55 10 18 10.45 18 11S17.55 12 17 12 16 11.55 16 11 16.45 10 17 10ZM5 14H19V16H5V14Z"
            fill="currentColor"
         />
         <path
            d="M9 11H15V13H9V11Z"
            fill="currentColor"
         />
         <circle
            cx="7"
            cy="15"
            r="1.5"
            fill="currentColor"
         />
         <circle
            cx="17"
            cy="15"
            r="1.5"
            fill="currentColor"
         />
      </Svg>
   );
};