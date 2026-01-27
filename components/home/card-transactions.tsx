import {Avatar, Card, Text} from '@nextui-org/react';
import React from 'react';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

export const CardTransactions = () => {
   return (
      <Card
         css={{
            mw: '375px',
            height: 'auto',
            background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
            borderRadius: '$xl',
            justifyContent: 'start',
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
            <Flex css={{gap: '$5'}} justify={'center'}>
               <Text h3 css={{textAlign: 'center', color: '#1f2937', fontWeight: '600'}}>
                  Latest Transactions
               </Text>
            </Flex>
            <Flex
               css={{gap: '$6', py: '$4'}}
               direction={'column'}
            >
               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'} css={{color: '#1f2937'}}>
                     Jose Perez
                  </Text>
                  <Text span css={{color: '#10b981', fontWeight: 'semibold'}} size={'$xs'}>
                     4500 USD
                  </Text>
                  <Text span css={{color: '#9ca3af'}} size={'$xs'}>
                     9/20/2021
                  </Text>
               </Flex>

               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'} css={{color: '#1f2937'}}>
                     Andrew Steven
                  </Text>
                  <Text span css={{color: '#10b981', fontWeight: 'semibold'}} size={'$xs'}>
                     4500 USD
                  </Text>
                  <Text span css={{color: '#9ca3af'}} size={'$xs'}>
                     9/20/2021
                  </Text>
               </Flex>
               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'} css={{color: '#1f2937'}}>
                     Ruben Garcia
                  </Text>
                  <Text span css={{color: '#10b981', fontWeight: 'semibold'}} size={'$xs'}>
                     1500 USD
                  </Text>
                  <Text span css={{color: '#9ca3af'}} size={'$xs'}>
                     2/20/2022
                  </Text>
               </Flex>
               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'} css={{color: '#1f2937'}}>
                     Perla Garcia
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     200 USD
                  </Text>
                  <Text span css={{color: '$accents8'}} size={'$xs'}>
                     3/20/2022
                  </Text>
               </Flex>
               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'}>
                     Mathew Funez
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     2444 USD
                  </Text>
                  <Text span css={{color: '$accents8'}} size={'$xs'}>
                     5/20/2022
                  </Text>
               </Flex>
               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'}>
                     Carlos Diaz
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     3000 USD
                  </Text>
                  <Text span css={{color: '$accents8'}} size={'$xs'}>
                     12/20/2022
                  </Text>
               </Flex>
            </Flex>
         </Card.Body>
      </Card>
   );
};
