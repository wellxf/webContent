<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html>
<head>

<title>挖藕产品查询</title>
<style type="text/css">
body {
	background-image: url('http://crunchify.com/bg.png');
}
</style>
</head>
<body>
	<br>
	<div style="text-align: center">
		<h1>
			您的产品序列号是 <b><%=request.getParameter("sn")%></b>!<br> <br>
			你购买的是由“挖藕”生产的智能控制器，是正版授权产品<br>
			稍后可将产品序列号发给小编，然后由我们的客服帮您答疑解难。<br>
		</h1>
		<img src="images/smile-face.png" alt="^_^">
	</div>
</body>
</html>