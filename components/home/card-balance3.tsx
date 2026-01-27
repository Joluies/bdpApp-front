import {Card, Text} from '@nextui-org/react';
import React from 'react';
import {Community} from '../icons/community';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

export const CardBalance3 = () => {
   return (
      <Card
         css={{
            mw: '375px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            borderRadius: '$xl',
            px: '$6',
            boxShadow: '0 10px 30px rgba(5, 150, 105, 0.3)',
            border: 'none',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
               boxShadow: '0 15px 40px rgba(5, 150, 105, 0.4)',
               transform: 'translateY(-4px)',
            },
            transition: 'all 0.3s ease',
         }}
      >
         <Card.Body css={{py: '$10'}}>
            <Flex css={{gap: '$5'}}>
               <Community />
               <Flex direction={'column'}>
                  <Text span css={{color: 'white', fontWeight: '600'}}>
                     Balance Insurance
                  </Text>
                  <Text span css={{color: 'rgba(255,255,255,0.8)'}} size={'$xs'}>
                     1311 Cars
                  </Text>
               </Flex>
            </Flex>
            <Flex css={{gap: '$6', py: '$4'}} align={'center'}>
               <Text
                  span
                  size={'$xl'}
                  css={{color: 'white', fontWeight: 'bold'}}
               >
                  $3,910
               </Text>
               <Text span css={{color: '#4ade80', fontWeight: 'semibold'}} size={'$xs'}>
                  + 4.5%
               </Text>
            </Flex>
            <Flex css={{gap: '$12'}} align={'center'}>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{color: '#4ade80', fontWeight: 'semibold'}}
                  >
                     {'↓'}
                  </Text>
                  <Text span size={'$xs'} css={{color: 'rgba(255,255,255,0.9)'}}>
                     100,930 USD
                  </Text>
               </Box>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{color: '#4ade80', fontWeight: 'semibold'}}
                     weight={'semibold'}
                  >
                     {'↑'}
                  </Text>
                  <Text span size={'$xs'} css={{color: '$white'}}>
                     54,120 USD
                  </Text>
               </Box>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{color: '$green600'}}
                     weight={'semibold'}
                  >
                     {'⭐'}
                  </Text>
                  <Text span size={'$xs'} css={{color: '$white'}}>
                     125 VIP
                  </Text>
               </Box>
            </Flex>
         </Card.Body>
      </Card>
   );
};
