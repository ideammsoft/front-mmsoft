<!-- #include file="KSPayWebHost.inc" -->
<!-- #include virtual="/include_ideakslee/dbconn_idea.asp" -->
<!-- #include virtual="/include_ideakslee/DB_SMS_PPURIO.asp" -->
<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
Response.CharSet = "utf-8"
Response.ContentType = "text/html"

Dim rcid    : rcid    = Request.Form("reCommConId")
Dim rctype  : rctype  = Request.Form("reCommType")
Dim rhash   : rhash   = Request.Form("reHash")
Dim payamt  : payamt  = Request.Form("sndAmount")
Dim uid     : uid     = Trim(Request.Form("a"))
Dim pamount : pamount = Trim(Request.Form("b"))
Dim pname   : pname   = Trim(Request.Form("c"))
Dim pApiFlg : pApiFlg = Trim(Request.Form("d"))

Const SPRING_INTERNAL_URL = "http://mm-admin-service:8080"
Const INTERNAL_SECRET     = "mmsoft-internal-key-2025"

' KSNET 서버와 통신하여 결제 결과 검증
Dim authyn : authyn = "X"
Dim amt    : amt    = ""
Dim msg1   : msg1   = ""
Dim trno   : trno   = ""

KSPayWebHost rcid, Null, payamt

If kspay_send_msg("1") Then
    authyn = kspay_get_value("authyn")
    amt    = kspay_get_value("amt")
    msg1   = kspay_get_value("msg1")
    trno   = kspay_get_value("trno")
End If

' DB 업데이트 및 SMS 알림 (결제 성공 시)
If authyn = "O" And uid <> "" And IsNumeric(pamount) And CLng(pamount) > 0 Then
    Dim pamt   : pamt   = CLng(pamount)
    Dim safeId : safeId = Replace(uid, "'", "''")
    Dim sql, rs

    If pApiFlg = "Y" Or InStr(pname, "API") > 0 Then
        ' ── API 키발급용 결제: manyman.payment 미업데이트, M_sms 이력만 기록 ──
        ' (noim_sms_balance 충전은 PaymentPage.jsx 에서 Spring 직접 호출)
        sql = "INSERT INTO M_sms (id, title, payment) VALUES ('" & safeId & "', '카드충전API', " & pamt & ")"
        Dbcon.Execute(sql)

    Else
        ' ── 일반 결제(로그인용 문자충전 / 소프트웨어 / 연회비): manyman.payment 업데이트 ──

        ' 잔액 업데이트 (전액 — 기존 로직 유지)
        sql = "UPDATE manyman SET payment = payment + " & pamt & " WHERE id = '" & safeId & "'"
        Dbcon.Execute(sql)

        ' 충전 이력 기록
        sql = "INSERT INTO M_sms (id, title, payment) VALUES ('" & safeId & "', '카드충전', " & pamt & ")"
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

' XSS 방지
Function EscJS(s)
    s = Replace(s, "\", "\\")
    s = Replace(s, "'", "\'")
    s = Replace(s, """", "\""")
    s = Replace(s, Chr(13), "")
    s = Replace(s, Chr(10), "")
    EscJS = s
End Function
%><!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>결제 결과 처리 중...</title>
<style>
body{font-family:'맑은 고딕','Malgun Gothic',sans-serif;background:#eef2f7;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.box{text-align:center;color:#555;font-size:15px}
.icon{font-size:40px;margin-bottom:12px}
.msg{margin-top:8px;font-size:13px;color:#777}
</style>
</head>
<body>
<div class="box">
  <div class="icon" id="ico">⏳</div>
  <p id="txt">결제 결과를 처리하고 있습니다...<br>잠시 기다려 주세요.</p>
  <p class="msg" id="sub"></p>
</div>
<script language="javascript">
(function() {
  var ok          = ("<%=EscJS(authyn)%>" === "O");
  var amt         = "<%=EscJS(amt)%>";
  var msg         = "<%=EscJS(msg1)%>";
  var isApiCharge = ("<%=EscJS(pApiFlg)%>" === "Y" || ("<%=EscJS(pname)%>").indexOf("API") >= 0);
  var chargeAmt   = isApiCharge ? Math.floor(parseInt(amt, 10) / 11 * 10) : 0;

  // PaymentPage.jsx(window.opener)로 결과 전달
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({
      type        : 'KSPAY_RESULT',
      ok          : ok,
      amt         : amt,
      msg         : msg,
      isApiCharge : isApiCharge,
      chargeAmt   : chargeAmt
    }, '*');
    setTimeout(function() { window.close(); }, 1200);
  } else {
    // 단독 사용 시 결과 인라인 표시
    document.getElementById('ico').textContent = ok ? '✅' : '❌';
    document.getElementById('txt').innerHTML   = ok
      ? '결제가 완료되었습니다.'
      : '결제가 완료되지 않았습니다.';
    document.getElementById('sub').textContent = ok
      ? amt + '원이 처리되었습니다.'
      : (msg || '');
  }
})();
</script>
</body>
</html>
