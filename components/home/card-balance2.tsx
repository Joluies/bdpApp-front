import {Card, Text} from '@nextui-org/react';
import React from 'react';
import {Community} from '../icons/community';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

export const CardBalance2 = () => {
   return (
      <Card
         css={{
            mw: '375px',
            background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
            borderRadius: '$xl',
            px: '$6',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
               boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)',
               transform: 'translateY(-4px)',
            },
            transition: 'all 0.3s ease',
         }}
      >
         <Card.Body css={{py: '$10'}}>
            <Flex css={{gap: '$5'}}>
               <Community color={'#6b7280'} />
               <Flex direction={'column'}>
                  <Text span css={{color: '#1f2937', fontWeight: '600'}}>
                     Health Insurance
                  </Text>
                  <Text span size={'$xs'} css={{color: '#6b7280'}}>
                     +2400 People
                  </Text>
               </Flex>
            </Flex>
            <Flex css={{gap: '$6', py: '$4'}} align={'center'}>
               <Text span size={'$xl'} weight={'semibold'} css={{color: '#1f2937'}}>
                  $12,138
               </Text>
               <Text span css={{color: '#ef4444'}} size={'$xs'} weight={'semibold'}>
                  + 4.5%
               </Text>
            </Flex>
            <Flex css={{gap: '$12'}} align={'center'}>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{color: '#10b981', fontWeight: 'semibold'}}
                  >
                     {'↓'}
                  </Text>
                  <Text span size={'$xs'} css={{color: '#6b7280'}}>
                     11,930 USD
                  </Text>
               </Box>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{color: '#ef4444', fontWeight: 'semibold'}}
                  >
                     {'↑'}
                  </Text>
                  <Text span size={'$xs'} css={{color: '#6b7280'}}>
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
                  <Text span size={'$xs'}>
                     150 VIP
                  </Text>
               </Box>
            </Flex>
         </Card.Body>
      </Card>
   );
};
