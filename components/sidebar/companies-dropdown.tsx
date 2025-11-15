import {Dropdown, Text} from '@nextui-org/react';
import React, {useState} from 'react';
import Image from 'next/image';
import {BottomIcon} from '../icons/sidebar/bottom-icon';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

interface Company {
   name: string;
   location: string;
   logo: React.ReactNode;
}

const BDPLogo = ({ size = 532 }) => (
   <Image 
      src="/logo/BDP-logo.png" 
      alt="Bebidas del Perú Logo" 
      width={size} 
      height={size}
      style={{
         objectFit: 'contain',
         borderRadius: '8px'
      }}
   />
);

export const CompaniesDropdown = () => {
   const [company, setCompany] = useState<Company>({
      name: 'Bebidas del Perú',
      location: 'Iquitos, Perú',
      logo: <BDPLogo />,
   });
   return (
      <Dropdown placement="bottom-right" borderWeight={'extrabold'}>
         <Dropdown.Trigger css={{cursor: 'pointer'}}>
            <Box>
               <Flex direction={'column'} align={'center'}>
                  {company.logo}
                  <Box css={{textAlign: 'center'}}>
                     <Text
                        h3
                        size={'$lg'}
                        weight={'medium'}
                        css={{
                           m: 0,
                           color: '$accents9',
                           lineHeight: '$lg',
                           mb: '$2',
                        }}
                     >
                        {company.name}
                     </Text>
                     <Text
                        span
                        weight={'medium'}
                        size={'$xs'}
                        css={{color: '$accents8'}}
                     >
                        {company.location}
                     </Text>
                  </Box>
                  <BottomIcon />
               </Flex>
            </Box>
         </Dropdown.Trigger>
         <Dropdown.Menu
            onAction={(e) => {
               if (e === '1') {
                  setCompany({
                     name: 'Bebidas del Perú',
                     location: 'Nauta, Loreto',
                     logo: <BDPLogo />,
                  });
               }
               if (e === '2') {
                  setCompany({
                     name: 'Bebidas del Perú - Centro',
                     location: 'Pucallpa, Perú',
                     logo: <BDPLogo />,
                  });
               }
               if (e === '3') {
                  setCompany({
                     name: 'Bebidas del Perú - Norte',
                     location: 'Yurimaguas, Perú',
                     logo: <BDPLogo />,
                  });
               }
               if (e === '4') {
                  setCompany({
                     name: 'Bebidas del Perú - Sur',
                     location: 'Santa Rosa, Perú',
                     logo: <BDPLogo />,
                  });
               }
            }}
            aria-label="Avatar Actions"
            css={{
               '$$dropdownMenuWidth': '340px',
               '$$dropdownItemHeight': '60px',
               '& .nextui-dropdown-item': {
                  'py': '$2',
                  // dropdown item left icon
                  'svg': {
                     color: '$secondary',
                     mr: '$4',
                  },
                  // dropdown item title
                  '& .nextui-dropdown-item-content': {
                     w: '100%',
                     fontWeight: '$semibold',
                  },
               },
            }}
         >
            <Dropdown.Section title="Sucursales">
               <Dropdown.Item
                  key="1"
                  icon={<BDPLogo size={24} />}
                  description="Lima, Perú"
               >
                  Bebidas del Perú
               </Dropdown.Item>
               <Dropdown.Item
                  key="2"
                  icon={<BDPLogo size={24} />}
                  description="Huancayo, Perú"
               >
                  Bebidas del Perú - Centro
               </Dropdown.Item>
               <Dropdown.Item
                  key="3"
                  icon={<BDPLogo size={24} />}
                  description="Trujillo, Perú"
               >
                  Bebidas del Perú - Norte
               </Dropdown.Item>
               <Dropdown.Item
                  key="4"
                  icon={<BDPLogo size={24} />}
                  description="Arequipa, Perú"
               >
                  Bebidas del Perú - Sur
               </Dropdown.Item>
            </Dropdown.Section>
         </Dropdown.Menu>
      </Dropdown>
   );
};
