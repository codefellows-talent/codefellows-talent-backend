# Standup Wednesday morning!

In attendance: Brook (client rep), Nicu, Ryan

Nicu: demonstrated progress on front end
	* CSS is coming along nicely
	* Today's task is to get MVP, begin testing

Back end: core functionality achieved
	* email: pretty formatted to hiring partner - get with Sarah regarding CF HTML email template
	* email to CF group account can include Salesforce ID as key for CF folks to find grad's personal info

Question from Nicu: CSV will be one file or many (one per update) on S3? -- one file.

Question from Ryan: anti-malicious use of email - CAPTCHA only works for front end, someone could curl up the POST route and send 234958423795 emails. Send confirmation email to hiring partner? Have an app token of some sort?
	* Brook: rate limit to 1 email per second? 
	* with rate limiting - examine rate limit headers (i.e. from GitHub)
	* on user signup: gradual engagement - let the user take as much action as possible before requiring an account - i.e. offer to allow user to sign in with OAuth to save the profiles they have selected to connect with
