import React from 'react';
import {Svg} from '../../styles/svg';

export const InventarioIcon = () => {
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
            d="M9 2C8.44772 2 8 2.44772 8 3V4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V6C22 4.89543 21.1046 4 20 4H16V3C16 2.44772 15.5523 2 15 2C14.4477 2 14 2.44772 14 3V4H10V3C10 2.44772 9.55228 2 9 2ZM4 8H20V20H4V8Z"
            fillRule="evenodd"
            clipRule="evenodd"
         />
         <path
            d="M7 12C6.44772 12 6 12.4477 6 13C6 13.5523 6.44772 14 7 14H17C17.5523 14 18 13.5523 18 13C18 12.4477 17.5523 12 17 12H7Z"
         />
         <path
            d="M7 17C6.44772 17 6 17.4477 6 18C6 18.5523 6.44772 19 7 19H12C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17H7Z"
         />
      </Svg>
   );
};
