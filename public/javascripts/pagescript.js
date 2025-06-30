jsforce.browser.init({
    clientId: '3MVG9VTfpJmxg1yiN0E5nWlm99SDfygO27sTx6LspydJVSXtiAq0iQ7OKuc6g9BK.LdEmdfoHbGQwTrcLP_b2',
    redirectUri: 'https://heroku-cdc-demo-de0da25d44c8.herokuapp.com',
    loginUrl : 'https://login.salesforce.com',
    version: '46.0',
});
  
jsforce.browser.on('connect', function(conn) {
    console.log(conn);
    // post information to /sessionId, then follow redirect link
    fetch( '/sessionId' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            accessToken: conn.accessToken,
            instanceUrl: conn.instanceUrl,
            orgId: conn.userInfo.organizationId,
            loginUrl: conn.loginUrl
        })
    })
    .then( response => {
        console.log(response);
        if (response.status === 302 || response.status === 200 ) {
            window.location.href = response.url;
        }
    })
});

const logout = () => {    
    jsforce.browser.logout();
}
