<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html>
<head>

<title>Spring MVC Tutorial Series by Crunchify.com</title>
<style type="text/css">
body {
	background-image: url('http://crunchify.com/bg.png');
}
</style>
</head>
<body>
	<br>
	<div style="text-align: center">
		<h2>
			您的产品序列号是 <b><%=request.getParameter("sn")%></b>!<br> <br>
			请将序列号发给小编，由我们的客服为您处理。<br>
		</h2>
		<img src="images/smile-face.png" alt="^_^">
	</div>
</body>
</html>