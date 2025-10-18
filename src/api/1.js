export const baseUrl = "https://i.sdu.edu.cn/XSZX/NXXT/api";
let token = localStorage.getItem('token')
if(!token){
	token = sessionStorage.getItem('token')
}
export function request(params = {}) {

	let {
		url,
		method = 'GET',
		body,
		dataType,
		header
	} = params;

	url = baseUrl + url;

	// 默认请求头
	const headers = header || {
		'Content-Type': 'application/x-www-form-urlencoded',
		Authorization: `Bearer ${token}`,
	};

	// 如果是 GET 或 HEAD，不能带 body，把参数拼到 URL
	if ((method === 'GET' || method === 'HEAD') && body) {
		const searchParams = new URLSearchParams(body);
		url += (url.includes('?') ? '&' : '?') + searchParams.toString();
		body = undefined; // 清除 body
	}

	// 如果是 POST/PUT 且 Content-Type 是 json，手动序列化
	if (
		body &&
		typeof body === 'object' &&
		headers['Content-Type']?.includes('application/json')
	) {
		body = JSON.stringify(body);
	}

	return fetch(url, {
			method,
			headers,
			body: method === 'GET' || method === 'HEAD' ? undefined : body,
		})
		.then((res) => {
			// 根据 dataType 决定返回格式
			if (dataType === 'json' || res.headers.get('content-type')?.includes('application/json')) {
				return res.json();
			} else {
				return res.text();
			}
		})
		.then((data)=>{
			return data;
			console.log(data);
		})


}