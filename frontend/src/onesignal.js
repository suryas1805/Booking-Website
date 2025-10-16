export async function initOneSignalSDK() {
    if (!window.OneSignal) window.OneSignal = [];
    if (window.OneSignal.__initialized) return;
    window.OneSignal.__initialized = true;

    window.OneSignal.push(() => {
        window.OneSignal.init({
            appId: '3a42e11e-7b59-4e70-a59d-9c6926248c7f',
            allowLocalhostAsSecureOrigin: true,
            notifyButton: { enable: true },
            subdomainName: 'testapp', // must match your OneSignal HTTP subdomain
        });

        // Show prompt if not subscribed
        window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
            if (!isEnabled) {
                console.log('User not subscribed → showing prompt');
                window.OneSignal.showSlidedownPrompt();
            }
        });

        // Listen for subscription changes
        window.OneSignal.on('subscriptionChange', (isSubscribed) => {
            console.log('Subscription changed:', isSubscribed);
            if (isSubscribed && window.OneSignal.__pendingUserId) {
                window.OneSignal.setExternalUserId(window.OneSignal.__pendingUserId)
                    .then(() => console.log('External ID set after subscription:', window.OneSignal.__pendingUserId))
                    .catch(err => console.error(err));
                window.OneSignal.__pendingUserId = null;
            }
        });
    });
}

export function setExternalUser(userId) {
    if (!window.OneSignal || !userId) return;

    // Store the ID temporarily in case the user isn't subscribed yet
    window.OneSignal.__pendingUserId = userId.toString();

    window.OneSignal.push(() => {
        window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
            if (isEnabled) {
                window.OneSignal.setExternalUserId(userId.toString())
                    .then(() => console.log('External ID set immediately:', userId))
                    .catch(err => console.error(err));
            } else {
                // Show prompt if user hasn’t subscribed yet
                window.OneSignal.showSlidedownPrompt();
            }
        });
    });
}
