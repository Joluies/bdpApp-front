import {Avatar, Card, Text} from '@nextui-org/react';
import React from 'react';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

const pictureUsers = [
   'https://i.pravatar.cc/150?u=a042581f4e29026024d',
   'https://i.pravatar.cc/150?u=a042581f4e29026704d',
   'https://i.pravatar.cc/150?u=a04258114e29026702d',
   'https://i.pravatar.cc/150?u=a048581f4e29026701d',
   'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
];

export const CardAgents = () => {
   return (
      <Card
         css={{
            mw: '375px',
            background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
            height: '275px',
            borderRadius: '$xl',
            alignContent: 'center',
            justifyContent: 'center',
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
         <Card.Body css={{py: '$10', gap: '$4'}}>
            <Flex
               css={{
                  width: '100%',
               }}
               justify={'center'}
            >
               <Flex
                  align={'center'}
                  direction={'row'}
                  justify={'center'}
                  css={{
                     width: '150px',
                     border: '2.5px dashed #d1d5db',
                     borderRadius: '$base',
                     background: 'rgba(59, 130, 246, 0.05)',
                  }}
               >
                  {'⭐'}
                  <Box>
                     <Flex direction={'column'}>
                        <Text h3 css={{margin: 0, color: '#1f2937', fontWeight: '600'}}>
                           Agents
                        </Text>
                     </Flex>
                  </Box>
               </Flex>
            </Flex>
            <Flex css={{gap: '$6', py: '$4'}} align={'center'}>
               <Text span size={'$xs'} css={{color: '#6b7280'}}>
                  Meet your agenda and see their ranks to get the best results
               </Text>
            </Flex>
            <Flex css={{pt: '$4'}} align={'center'} justify={'center'}>
               <Avatar.Group count={12}>
                  {pictureUsers.map((url, index) => (
                     <Avatar
                        key={index}
                        size="lg"
                        pointer
                        src={url}
                        bordered
                        color="gradient"
                        stacked
                     />
                  ))}
               </Avatar.Group>
            </Flex>
         </Card.Body>
      </Card>
   );
};
