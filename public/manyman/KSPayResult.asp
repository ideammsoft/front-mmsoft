<!-- #include file="KSPayWebHost.inc" -->
<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
Response.CharSet = "utf-8"
Response.ContentType = "text/html"

Dim rcid   : rcid   = Request.Form("reCommConId")
Dim rctype : rctype = Request.Form("reCommType")
Dim rhash  : rhash  = Request.Form("reHash")
Dim payamt : payamt = Request.Form("sndAmount")

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
.box{text-align:center;color:#555;font-size:14px}
.icon{font-size:36px;margin-bottom:12px}
</style>
</head>
<body>
<div class="box">
  <div class="icon">⏳</div>
  <p>결제 결과를 처리하고 있습니다...<br>잠시 기다려 주세요.</p>
</div>
<script language="javascript">
(function() {
  var ok  = ("<%=EscJS(authyn)%>" === "O");
  var amt = "<%=EscJS(amt)%>";
  var msg = "<%=EscJS(msg1)%>";

  // PaymentPage.jsx(window.opener)로 결과 전달
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({
      type : 'KSPAY_RESULT',
      ok   : ok,
      amt  : amt,
      msg  : msg
    }, '*');
  }

  // 1초 후 자동 닫기
  setTimeout(function() { window.close(); }, 1000);
})();
</script>
</body>
</html>
