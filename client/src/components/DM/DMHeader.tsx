import React from 'react';
import styled from 'styled-components';
import ClearIcon from '@mui/icons-material/Clear';
import { useAppDispatch } from '../../hooks';
import logo from '../../images/logo.png';

export function DMHeader() {
  return (
    <DMtop>
      <PrivateMessageHeader>
        <TitleImage src={logo} width="30" />
        <TitleText>개인 메시지</TitleText>
      </PrivateMessageHeader>
    </DMtop>
  );
}

// <~ 님과의 개인메시지>, 또는 <닉네임>
const TitleImage = styled.img`
  margin-left: 2px;
  margin-right: 10px;
  width: 25px;
`;
const TitleText = styled.div`
  font-size: 25px;
`;
// 준택이가 만든 것 테마 따라가기
const DMtop = styled.div`
  background: white;
  padding: 0px 0px 0px 20px;
  font-size: 28px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  font-weight: bold;
  display: flex;
  height: 60px;
  flex-direction: row;
  alsign-items: center;
  justify-content: space-between;
`;
const PrivateMessageHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;