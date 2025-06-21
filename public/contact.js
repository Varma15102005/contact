document.addEventListener('DOMContentLoaded', function() {
    const sendMagicLinkBtn = document.getElementById('sendMagicLinkBtn');
    const submitBtn = document.getElementById('submitBtn');
    const emailInput = document.getElementById('emailInput');

    if (sendMagicLinkBtn) {
        sendMagicLinkBtn.addEventListener('click', function() {
            alert('Magic link sending...');
            const name = document.getElementById('nameinput1').value.trim();
            const email = emailInput.value.trim();
            const message = document.getElementById('messageInput').value.trim();
            if (!email || !name || !message) {
                alert('Please fill in all fields.');
                return;
            }
            fetch('http://localhost:3000/submit', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, email, message })
            })
            .then(res => res.text())
            .then(text => {
                alert(text);
            })
            .catch(() => {
                alert('Error sending magic link.');
            });
        });
    }
});