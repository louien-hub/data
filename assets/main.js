// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsIHF6J6_FxVR98t_f1p42dkwGr4fZYVg",
    authDomain: "monitor-56a58.firebaseapp.com",
    databaseURL: "https://monitor-56a58-default-rtdb.firebaseio.com",
    projectId: "monitor-56a58",
    storageBucket: "monitor-56a58.appspot.com",
    messagingSenderId: "840861019660",
    appId: "1:840861019660:web:93883744d05224023e4829"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const data_fetch = `
<div class="\${cardClass}">
    <div class="\${cardHeader}">
        \${email}
    </div>
    <div class="card-body">
        <blockquote class="blockquote mb-0">
        <p class="p-feedback">\${feedback}</p>
        <br>
        <footer class="blockquote-footer"><cite title="Source Title">\${timestamp}</cite></footer>
        </blockquote>
    </div>
</div>
`;

document.addEventListener('DOMContentLoaded', function () {
    const feedbackList = document.getElementById('feedbackList');
    const feedbackRef = firebase.database().ref('feedback');

    // Function to display feedback on the webpage
    function displayFeedback({ email, feedback, timestamp }) {
        const feedbackDiv = document.createElement('div');

        // Check if feedback contains a bad word
        const hasBadWord = containsBadWord(feedback);

        // Use the `border-danger` class if feedback contains a bad word
        const cardClass = `card mb-3 ${hasBadWord ? 'border-danger' : ''}`;
        const cardHeader = `card-header ${hasBadWord ? 'bg-danger' : ''}`;

        feedbackDiv.innerHTML = data_fetch.replace(/\${email}/g, email)
                                          .replace(/\${feedback}/g, feedback)
                                          .replace(/\${timestamp}/g, timestamp)
                                          .replace(/\${cardClass}/g, cardClass)
                                          .replace(/\${cardHeader}/g, cardHeader);

        feedbackList.appendChild(feedbackDiv);
    }

    // Function to check if feedback contains a bad word
    function containsBadWord(feedback) {
        const badWords = ['need' && 'improve', 'need' && 'improvement']; // Add your list of bad words here
        return badWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(feedback));
    }

    // Fetch feedback data and listen for changes
    feedbackRef.on('value', snapshot => {
        // Clear existing feedback before re-rendering
        feedbackList.innerHTML = '';

        snapshot.forEach(childSnapshot => {
            const { email, feedback, timestamp } = childSnapshot.val();
            displayFeedback({ email, feedback, timestamp });
        });
    });

    // Handle errors
    feedbackRef.on('error', error => {
        console.error('Error fetching feedback:', error);
    });
});
