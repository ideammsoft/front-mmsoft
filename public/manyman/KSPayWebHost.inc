<% Option Explicit %>
<%
	dim		i
	const	kwh_KSPAY_WEBHOST_URL		= "http://kspay.ksnet.to/store/KSPayWebV1.4/web_host/recv_post.jsp" 
	const	kwh_DEFAULT_RPARAMS			= "authyn`trno`trddt`trdtm`amt`authno`msg1`msg2`ordno`isscd`aqucd`result`resultcd"
	const	kwh_DEFAULT_DELIMS			= "`"
	dim		kwh_payKey
	dim		kwh_rparams
	dim		kwh_mtype
	dim		kwh_payAmt
	dim		kwh_rnames
    dim		kwh_rvalues

    ' authyn : O/X 상태
    ' trno   : KSNET거래번호(영수증 및 취소 등 결제데이터용 KEY
    ' trddt  : 거래일자(YYYYMMDD)
    ' trdtm  : 거래시간(hhmmss)
    ' amt    : 금액
    ' authno : 승인번호(신용카드:결제성공시), 에러코드(신용카드:승인거절시), 은행코드(가상계좌,계좌이체)
    ' ordno  : 주문번호
    ' isscd  : 발급사코드(신용카드), 가상계좌번호(가상계좌) ,기타결제수단의 경우 의미없음
    ' aqucd  : 매입사코드(신용카드)
    ' result : 승인구분
    ' resultcd : 응답코드

	function KSPayWebHost(p_payKey, p_rparams, p_amt)
		kwh_payKey		= p_payKey

		If IsNull(p_rparams) or (p_rparams = "") then
			kwh_rparams	= kwh_DEFAULT_RPARAMS
		Else
			kwh_rparams	= p_rparams
		End If
		
		kwh_payAmt      = p_amt
		kwh_rnames  = Split(kwh_rparams, kwh_DEFAULT_DELIMS)

		redim		kwh_rvalues(UBound(kwh_rnames))

		KSPayWebHost = true
	end function

	function kspay_send_msg(p_mtype)
		kwh_mtype = p_mtype
		dim rmsg : rmsg = kspay_send_url()
		dim	tmpvals

'response.write "kspay_send_msg..1=["&UBound(kwh_rnames)&":"&UBound(kwh_rvalues) & "]rmsg=["&InStr(rmsg,"`")&":"&rmsg&"]<br>"
		kspay_send_msg = false
		if InStr(rmsg,"`") <> 0 then
			tmpvals = Split(rmsg, kwh_DEFAULT_DELIMS)

'response.write "kspay_send_msg..2=["&UBound(kwh_rvalues)&":"&UBound(tmpvals)&"]<br>"

			if UBound(kwh_rvalues) < UBound(tmpvals) then
				for i = 0 To UBound(kwh_rvalues)
					kwh_rvalues(i) = tmpvals(i+1)
'response.write "kspay_send_msg.3=["&i&":"&kwh_rnames(i)&":"  & kwh_rvalues(i) & "]<br>"
				next
				kspay_send_msg = true
			end if
		end if
	end function

	function kspay_get_value(p_name)
		kspay_get_value = ""
		if IsNull(p_name) or (p_name = "") or False = IsArray(kwh_rnames) or False = IsArray(kwh_rvalues) or UBound(kwh_rnames) <> UBound(kwh_rvalues) then
			kspay_get_value = ""
		else
			for i = 0 To UBound(kwh_rnames)
				if False = IsNull(kwh_rnames(i)) and kwh_rnames(i) = p_name then
					kspay_get_value = kwh_rvalues(i)
					exit for
				end if
			next
		end if
	end function

	function kspay_send_url()
		dim resultPost : resultPost = ""

		kspay_send_url = ""
		on error resume next

		dim post_msgs : post_msgs = "sndCommConId=" & kwh_payKey & "&sndActionType=" & kwh_mtype & "&sndAmount=" & kwh_payAmt & "&sndRpyParams=" & server.URLEncode(kwh_rparams)

'response.write "post_msgs=["  & post_msgs & "]"

		dim oHttp
		set oHttp = createobject("MSXML2.ServerXMLHTTP")

		oHttp.open "GET", kwh_KSPAY_WEBHOST_URL & "?" & post_msgs, false
		oHTTP.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"
		oHttp.Send ""

		if err.number > 0 or oHttp.status <> 200 then
		    'Response.Write "Error Number is " & Err.Number & "<br>" '에러번호 호출
		    'Response.write "Error Description is "& Err.Description & "<br>" '에러설명 호출
		    'Response.Write "Error Source is " & Err.Source & "<br>" '에러소스 호출
			Err.Clear             '에러 지워줌
		else
			'kspay_send_url = oHttp.ResponseText
			kspay_send_url = BinaryToText(oHttp.ResponseBody,"euc-kr")
'response.write "kspay_send_url=["  & kspay_send_url & "]<br>"
		end if

		Set oHttp = Nothing
	end function

	Function  BinaryToText(BinaryData, CharSet)

		Const adTypeText = 2
		Const adTypeBinary = 1

		Dim BinaryStream
		Set BinaryStream = CreateObject("ADODB.Stream")


		'원본 데이터 타입
		BinaryStream.Type = adTypeBinary

		BinaryStream.Open
		BinaryStream.Write BinaryData

		' binary -> text
		BinaryStream.Position = 0
		BinaryStream.Type = adTypeText

		'변환할 데이터 캐릭터셋
		BinaryStream.CharSet = CharSet

		'변환한 데이터 반환
		BinaryToText = BinaryStream.ReadText
		'response.write "BinaryToText=["  & BinaryToText & "]<br>"

	End Function
%>