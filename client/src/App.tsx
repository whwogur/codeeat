import { useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import { useAppSelector, useAppDispatch } from './hooks'
import { DIALOG_STATUS, HELPER_STATUS } from './stores/UserStore'

// ↓ Entry Dialog
import EntryDialog from './components/entrydialog/EntryDialog'
import LoginDialog from './components/entrydialog/LoginDialog'
import JoinDialog from './components/entrydialog/JoinDialog'
import WelcomeDialog from './components/entrydialog/WelcomeDialog'

// ↓ Game Dialog
import GameLobbyDialog from './components/gamedialog/GameLobbyDialog'
import GameWelcomeDialog from './components/gamedialog/GameWelcomeDialog'
import MoleGameDialog from './components/games/MoleGame/MoleGameDialog'
import BrickGameDialog from './components/games/BrickGame/BrickGameDialog'
import RainGameDialog from './components/games/RainGame/RainGameDialog'
// import FaceChatDialog from './components/games/FaceChatDialog'

// ↓ HelperButtonGroup Dialog
import HelperButtonGroup from './components/helperdialog/HelperButtonGroup'
import ChatDialog from './components/helperdialog/ChatDialog'
import { ConversationList } from './components/DM/DMList'
import { DMRoom } from './components/DM/DMRoom'
import UsersDialog from './components/helperdialog/UsersDialog'
import FriendsDialog from './components/helperdialog/FriendsDialog'
import LogoutDialog from './components/helperdialog/LogoutDialog'
import VersionDialog from './components/helperdialog/VersionDialog'
import MobileVirtualJoystick from './components/helperdialog/MobileVirtualJoystick'
// import VideoConnectionDialog from './components/VideoConnectionDialog'

// ↓ Profile Button & Dialog
import ProfileButton from './components/ProfileButton'
import ProfileDialog from './components/ProfileDialog'

import GlobalFont from '../public/assets/fonts/GlobalFont'

// import { authenticateUser } from './apicalls/auth';

// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

// TODO: Production 서버에 옮겨가면 해당 부분 수정 필요 
// axios.defaults.baseURL = 'http://43.200.172.83:2567'
axios.defaults.baseURL = 'http://localhost:2567'
console.log('axios.defaults.baseURL ', axios.defaults.baseURL);

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function App() {
  const dispatch = useAppDispatch()
  const dialogStatus = useAppSelector((state) => state.user.dialogStatus)

  // ↓ Game Dialog
  const brickGameOpen = useAppSelector((state) => state.brickgame.brickGameOpen)
  const moleGameOpen = useAppSelector((state) => state.molegame.moleGameOpen)
  const rainGameOpen = useAppSelector((state) => state.rainGameDialog.rainGameOpen)
  // const faceChatOpen = useAppSelector((state) => state.facechat.faceChatOpen)

  // ↓ HelperButtonGroup Dialog
  const helperStatus = useAppSelector((state) => state.user.helperStatus)
  const showDMList = useAppSelector((state) => state.dm.showDMList)
  const showDMRoom = useAppSelector((state) => state.dm.showDMRoom)


  // TODO: cookie 가져오는 부분 해결 필요 
  // useEffect(() => {
  //   // 첫 렌더링 시, refresh token이 있다면 token 인증을 통해 entry 상태를 설정 
  //   // const refreshToken = cookies.get('refreshToken');
  //   // console.log('refresh token: ', refreshToken)
  //   // if (refreshToken) { 
  //   authenticateUser().then((result) => {
  //     if (result.status === 200) {
  //       dispatch(setEntryProcess(ENTRY_PROCESS.WELCOME));
  //     }
  //   })
  //   // }
  // }, [])

  let ui: JSX.Element
  if (dialogStatus === DIALOG_STATUS.JOIN) {
    ui = <JoinDialog />
  } else if (dialogStatus === DIALOG_STATUS.LOGIN) {
    ui = <LoginDialog />
  } else if (dialogStatus === DIALOG_STATUS.WELCOME) {
    ui = <WelcomeDialog />
  } else if (dialogStatus === DIALOG_STATUS.IN_MAIN) {
    ui = (
      <>
        {helperStatus === HELPER_STATUS.PROFILE && <ProfileDialog />}
        {helperStatus === HELPER_STATUS.CHAT && <ChatDialog />}
        {/* {helperStatus === HELPER_STATUS.DM && <ConversationList />} */}
        {helperStatus === HELPER_STATUS.USERS && <UsersDialog />}
        {helperStatus === HELPER_STATUS.FRIENDS && <FriendsDialog />}
        {helperStatus === HELPER_STATUS.LOGOUT && <LogoutDialog />}
        {helperStatus === HELPER_STATUS.VERSION && <VersionDialog />}

        {showDMList && <ConversationList />}
        {showDMRoom && <DMRoom />}
        <MobileVirtualJoystick />
        <HelperButtonGroup />
        <ProfileButton />
      </>
    )
  } else if (dialogStatus === DIALOG_STATUS.GAME_LOBBY) {
    ui = <GameLobbyDialog />
  } else if (dialogStatus === DIALOG_STATUS.GAME_WELCOME) {
    ui = <GameWelcomeDialog />
  } else if (dialogStatus === DIALOG_STATUS.IN_GAME) {
    if (brickGameOpen) ui = <BrickGameDialog />
    if (moleGameOpen) ui = <MoleGameDialog />
    if (rainGameOpen) ui = <RainGameDialog />
    // if (faceChatOpen) ui = <FaceChatDialog />
  } else {
    ui = <EntryDialog />
  }

  return (
    <Backdrop>
      <GlobalFont />
      {ui}
    </Backdrop>
  )
}

export default App
