const axios = require('axios');

const ONE_SIGNAL_APP_ID = '3a42e11e-7b59-4e70-a59d-9c6926248c7f';
const ONE_SIGNAL_REST_API_KEY = 'os_v2_app_hjbocht3lfhhbjm5trusmjemp7q3kzjinpnue5v2m3o5attogkhjhozfi2uhxbp3rpzqipb23lbvsbd7vgj7ljsmczduk5ywwe4bufa';

async function sendPushNotification({ title, message, userIds = [] }) {
    if (!userIds || userIds.length === 0) return;

    try {
        const data = {
            app_id: ONE_SIGNAL_APP_ID,
            headings: { en: title },
            contents: { en: message },
            include_external_user_ids: userIds.map(id => id.toString()),
        };

        const response = await axios.post('https://onesignal.com/api/v1/notifications', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${ONE_SIGNAL_REST_API_KEY}`,
            },
        });

        // console.log('Notification sent:', response.data);
    } catch (err) {
        console.error('Error sending notification:', err.response?.data || err.message);
    }
}

module.exports = sendPushNotification;
