import {Collapse, Text, Button} from '@nextui-org/react';
import React, {useState} from 'react';
import {ChevronUpIcon} from '../icons/sidebar/chevron-up-icon';
import {Flex} from '../styles/flex';

interface ReportItem {
   name: string;
   onDownload: () => void;
}

interface Props {
   icon: React.ReactNode;
   title: string;
   items: ReportItem[];
}

export const CollapseItemsWithAction = ({icon, items, title}: Props) => {
   const [open, setOpen] = useState(false);

   const handleToggle = () => setOpen(!open);
   
   return (
      <Flex
         css={{
            gap: '$6',
            height: '100%',
            alignItems: 'center',
            cursor: 'pointer',
         }}
         align={'center'}
      >
         <Collapse
            title={
               <Flex
                  css={{
                     'gap': '$6',
                     'width': '100%',
                     'py': '$5',
                     'px': '$7',
                     'borderRadius': '8px',
                     'transition': 'all 0.15s ease',
                     '&:active': {
                        transform: 'scale(0.98)',
                     },
                     '&:hover': {
                        bg: '$accents2',
                     },
                  }}
                  justify={'between'}
                  onClick={handleToggle}
               >
                  <Flex css={{gap: '$6'}}>
                     {icon}
                     <Text
                        span
                        weight={'normal'}
                        size={'$base'}
                        css={{
                           color: '$accents9',
                        }}
                     >
                        {title}
                     </Text>
                  </Flex>

                  <ChevronUpIcon
                     css={{
                        transition: 'transform 0.3s ease',
                        transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
                     }}
                  />
               </Flex>
            }
            css={{
               'width': '100%',
               '& .nextui-collapse-view': {
                  p: '0',
               },
               '& .nextui-collapse-content': {
                  marginTop: '$1',
                  padding: '0px',
               },
            }}
            divider={false}
            showArrow={false}
         >
            {items.map((item, index) => (
               <Flex
                  key={index}
                  direction={'row'}
                  align={'center'}
                  justify={'between'}
                  css={{
                     'paddingLeft': '$16',
                     'paddingRight': '$8',
                     'paddingY': '$2',
                     'borderRadius': '8px',
                     'transition': 'all 0.15s ease',
                     '&:hover': {
                        bg: '$accents1',
                     },
                  }}
               >
                  <Text
                     span
                     weight={'normal'}
                     size={'$md'}
                     css={{
                        color: '$accents8',
                        flex: 1,
                     }}
                  >
                     {item.name}
                  </Text>
                  <Button
                     auto
                     size="xs"
                     color="success"
                     css={{
                        minWidth: 'auto',
                        padding: '$2 $4',
                     }}
                     onClick={(e) => {
                        e.stopPropagation();
                        item.onDownload();
                     }}
                  >
                     📥 Excel
                  </Button>
               </Flex>
            ))}
         </Collapse>
      </Flex>
   );
};
