<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
Response.CharSet = "utf-8"
Response.ContentType = "text/html"

Dim rcid      : rcid      = Request.Form("reCommConId")
Dim rctype    : rctype    = Request.Form("reCommType")
Dim rhash     : rhash     = Request.Form("reHash")
Dim rcncntype : rcncntype = Request.Form("reCnclType")

' XSS 방지: 특수문자 이스케이프
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
<title>KSPay Receive</title>
</head>
<body>
<script language="javascript">
(function() {
  var cancel = ("<%=EscJS(rcncntype)%>" === "1");
  // 부모(index.html)로 결과 전달 (cross-origin postMessage)
  window.parent.postMessage({
    type   : 'KSPAY_RCV',
    cancel : cancel,
    rcid   : '<%=EscJS(rcid)%>',
    rctype : '<%=EscJS(rctype)%>',
    rhash  : '<%=EscJS(rhash)%>'
  }, '*');
})();
</script>
</body>
</html>
