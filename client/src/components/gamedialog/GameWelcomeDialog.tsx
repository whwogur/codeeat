import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { DIALOG_STATUS, setDialogStatus } from '../../stores/UserStore'

// import Adam from '../../images/login/Adam_login.png'
// import Ash from '../../images/login/Ash_login.png'
// import Lucy from '../../images/login/Lucy_login.png'
// import Nancy from '../../images/login/Nancy_login.png'

// ***새롭게 16px 캐릭터로 변경하기 위한 코드***
import Noah from '../../images/login/Noah_login.png'
import Nora from '../../images/login/Nora_login.png'
import Owen from '../../images/login/Owen_login.png'
import Maya from '../../images/login/Maya_login.png'
import Jiji from '../../images/login/Jiji_login.png'
import John from '../../images/login/John_login.png'
import Mina from '../../images/login/Mina_login.png'
import Ryan from '../../images/login/Ryan_login.png'

import phaserGame from '../../PhaserGame'
import Game from '../../scenes/Game'


const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'CustomFont';
    src: url('/assets/fonts/DungGeunMo.woff') format('woff');
  }

  body {
    font-family: 'CustomFont', sans-serif;
    letter-spacing: 2px;
  }
`

const Wrapper = styled.form`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`

const Title = styled.h3`
  margin: 5px;
  font-size: 25px;
  color: #c2c2c2;
  text-align: center;
`

const Content = styled.div`
  display: flex;
  margin: 36px 0;
`

const Left = styled.div`
  margin-right: 48px;
`

const ImgContainer = styled.div`
    width: 160px;
    height: 220px;
    background: #dbdbe0;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;  

    img {
        display: block;
        width: 95px;
        height: 136px;
        object-fit: contain;
    }
`

const Right = styled.div`
  width: 300px;
`

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  Button {
    font-size: 20px;
    font-family: Font_DungGeun;
  }
`

const Warning = styled.div`
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const avatars = [
  // { name: 'adam', img: Adam },
  // { name: 'ash', img: Ash },
  // { name: 'lucy', img: Lucy },
  // { name: 'nancy', img: Nancy },

  // ***새롭게 16px 캐릭터로 변경하기 위한 코드***
  { name: 'noah', img: Noah },
  { name: 'nora', img: Nora },
  { name: 'maya', img: Maya },
  { name: 'owen', img: Owen },
  { name: 'jiji', img: Jiji },
  { name: 'john', img: John },
  { name: 'mina', img: Mina },
  { name: 'ryan', img: Ryan },
]

export default function GameWelcomeDialog() {
  const dispatch = useAppDispatch()
  const gameJoined = useAppSelector((state) => state.room.gameJoined)
  // const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const character = useAppSelector((state) => state.user.character)
  const username = useAppSelector((state) => state.user.username)
  const index = avatars.findIndex((avatar) => avatar.name === character)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(setDialogStatus(DIALOG_STATUS.IN_GAME))
  }

  return (
    <>
    <GlobalStyle />
    <Wrapper onSubmit={handleSubmit}>
      <Title>게임을 시작해볼까요 !</Title>
      <Content>
        <Left>
          <ImgContainer>
            <img className="character-avatar" 
                src={avatars[index].img} 
                alt={avatars[index].name} /> 
          </ImgContainer>
        </Left>
        <Right>
            <h1 style={{ fontSize: '24px' }}>{username} 님</h1>
        </Right>
      </Content>
      <Bottom>
        <Button variant="contained" size="large" type="submit">
          입장하기
        </Button>
      </Bottom>
    </Wrapper>
    </>
  )
}
