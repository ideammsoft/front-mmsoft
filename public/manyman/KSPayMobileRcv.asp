<!-- #include virtual="/include_ideakslee/dbconn_idea.asp" -->
<!-- #include virtual="/include_ideakslee/DB_SMS_PPURIO.asp" -->
<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
Response.CharSet = "utf-8"

' ── QueryString: index.html이 sndReply에 붙여서 전달 ──
Dim uid     : uid     = Trim(Request.QueryString("uid"))
Dim pamount : pamount = Trim(Request.QueryString("pamount"))
Dim pApiFlg : pApiFlg = Trim(Request.QueryString("apiflg"))

' ── POST: KSPay 모바일 게이트웨이 결과 ──
Dim authyn : authyn = Trim(Request.Form("authyn"))
Dim amt    : amt    = Trim(Request.Form("amt"))
Dim msg1   : msg1   = Trim(Request.Form("msg1"))

' ── DB 업데이트 (결제 성공 시) ──
If authyn = "O" And uid <> "" And IsNumeric(pamount) And CLng(pamount) > 0 Then
    Dim pamt   : pamt   = CLng(pamount)
    Dim safeId : safeId = Replace(uid, "'", "''")
    Dim sql, rs

    If pApiFlg = "Y" Then
        ' API 키발급용: M_sms 이력만 기록 (noim_sms_balance 충전은 React에서 Spring 호출)
        sql = "INSERT INTO M_sms (id, title, payment) VALUES ('" & safeId & "', '카드충전-API(모바일)', " & pamt & ")"
        Dbcon.Execute(sql)
    Else
        ' 일반 결제: manyman.payment 업데이트 + 이력 기록 + SMS
        sql = "UPDATE manyman SET payment = payment + " & pamt & " WHERE id = '" & safeId & "'"
        Dbcon.Execute(sql)

        sql = "INSERT INTO M_sms (id, title, payment) VALUES ('" & safeId & "', '카드충전(모바일)', " & pamt & ")"
        Dbcon.Execute(sql)

        ' SMS 발송 (ppurio)
        sql = "SELECT mphone FROM manyman WHERE id = '" & safeId & "'"
        Set rs = Dbcon.Execute(sql)
        If Not rs.EOF Then
            Dim mphone : mphone = Trim(rs("mphone"))
            If Left(mphone, 2) = "01" Then
                Dim hv, mv, sv
                hv = Hour(Now)   : If Len(hv) < 2 Then hv = "0" & hv
                mv = Minute(Now) : If Len(mv) < 2 Then mv = "0" & mv
                sv = Second(Now) : If Len(sv) < 2 Then sv = "0" & sv
                Dim cmid2
                Randomize
                cmid2 = Replace(FormatDateTime(Now(), 2), "-", "") & hv & mv & sv & _
                        Replace(CStr(Timer()), ".", "") & Replace(CStr(Rnd()), ".", "")
                Dim msgBody : msgBody = "문자메시지 " & FormatNumber(pamt, 0) & "원이 충전되었습니다(카드결제). - 엠엠소프트"
                sql = "INSERT INTO ums_data (cmid, msg_type, status, request_time, dest_phone, send_phone, msg_body, etc1, etc2, etc3, etc4) " & _
                      "VALUES ('" & cmid2 & "', '0', '0', GETDATE(), '" & Replace(mphone, "-", "") & "', '028647576', '" & msgBody & "', '', 'manyman', '', '')"
                Db_ppu.Execute(sql)
            End If
        End If
        rs.Close
        Set rs = Nothing
    End If
End If

' ── API 충전 금액 계산 (React에서 Spring 호출용) ──
Dim chargeAmt : chargeAmt = 0
If pApiFlg = "Y" And authyn = "O" And IsNumeric(amt) And CLng(amt) > 0 Then
    chargeAmt = (CLng(amt) \ 11) * 10
End If

' ── React PaymentPage로 리다이렉트 ──
Dim ok : ok = "false"
If authyn = "O" Then ok = "true"

Dim qs
qs = "mobileResult=1"
qs = qs & "&ok=" & ok
qs = qs & "&amt=" & Server.URLEncode(amt)
qs = qs & "&msg=" & Server.URLEncode(msg1)
qs = qs & "&isApi=" & pApiFlg
qs = qs & "&chargeAmt=" & chargeAmt
qs = qs & "&uid=" & Server.URLEncode(uid)

Response.Redirect "/payment?" & qs
%>
