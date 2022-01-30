import React from 'react';
import appConfig from '../config.json';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { useRouter } from 'next/router';
import { Box, Text, TextField, Image,  Button } from '@skynexui/components';
import { createClient } from '@supabase/supabase-js';



const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM5NTE2MywiZXhwIjoxOTU4OTcxMTYzfQ.-SSDCl3Z6IPUSXZy_natGfT9ilyVwzO2lkYIVOlORos';
const SUPABE_URL = 'https://ysgxykhranovcpypvazs.supabase.co';
const supabaseClient = createClient(SUPABE_URL, SUPABASE_ANON_KEY);
    

function escutaMsgTempoReal (addMsg) {
    return supabaseClient
      .from('messages')
      .on('INSERT', (responseLive) => {
        addMsg(responseLive.new);
      })
      .subscribe()
}


export default function ChatPage() {
  const routing = useRouter();
  const logUser = routing.query.username;
//   console.log(routing.query);
//   console.log('logUser', logUser);
  const [message, setMessage] = React.useState('');
  const [listMessage, setListMessage] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
        .from('messages')
        .select('*')
        .order('id', { ascending: false})
        .then(({ data } ) => {
           // console.log(data);
            setListMessage(data);
        }) //uma função

        escutaMsgTempoReal((newMessage) => {
          console.log('oq tem aqui?', newMessage);
               setListMessage((valorAtualLista) => {
                   return [
                       newMessage, 
                       ...valorAtualLista,
                   ]
               })
        });
    }, []);

    const hadleChange = (e) => { 
      setMessage(e.target.value) 
    }

    const getNewMessage = (newMessage) => {
        const messageObj = {
            //id: listMessage.length + 1,
            de: logUser,
            text: newMessage,
        }

        supabaseClient
        .from('messages')
        .insert([
            messageObj
        ])
       .then(({ data }) => {
           console.log('criando mensagem', data);
         });
        setMessage('');      
    }

    return (
      
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[''],
                // backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals['blue'],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                
                <MessageList mensagens={listMessage} setM={setListMessage} /> 

                <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        
                        <TextField
                            value={message}
                            onChange={hadleChange}
                            onKeyPress={(e) => {
                              if(e.key === 'Enter') {
                                e.preventDefault();
                                getNewMessage(message);
                              }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/* {Callback} */}
                        <ButtonSendSticker 
                            onStickerClick={(sticker)=> {
                                // console.log('vai p banco', sticker);
                                getNewMessage(':sticker: ' + sticker)
                            }}
                        />
                        
                        <Button   
                            label = 'enviar'  
                            value={message}
                            onClick={(e) => {
                                e.preventDefault();
                                getNewMessage(message)
                            }}
                        />    
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
      
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}



function MessageList(props) {

    function handleRemove(id) {
        const list = props.mensagens.filter((messageObj) => messageObj.id !== id);
        props.setM(list);
    }
    
    // console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((messageObj) => {
                return (
                    <Text
                        key={messageObj.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://files.nsctotal.com.br/s3fs-public/styles/paragraph_image_style/public/graphql-upload-files/logo%20bbb%20nas%20redes%20sociais_10.jpg?LE6C3KFYtrUi2bBWMCwqDAzLhkzdB13D&itok=YtONjT0z`}
                            />
                            <Text tag="strong">
                                {messageObj.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                
                                {(new Date().toLocaleDateString())}
                            </Text>
                            <Button
                                label="x"
                                onClick={() => {
                                    handleRemove(messageObj.id)
                                }}

                            />
                        </Box>
                        {messageObj.text.startsWith(':sticker:') 
                        ?(
                            <Image src={messageObj.text.replace('sticker:', '')} />
                        ) 
                        : (
                            messageObj.text
                        )}  
                    </Text>
                );
            })}   
        </Box>
    )
}
