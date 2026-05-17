document.addEventListener('DOMContentLoaded', function () {

    /* =========================
       HEADER SCROLL EFFECT
    ========================= */
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    /* =========================
       DATE OF BIRTH SETTINGS
    ========================= */
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');

    /* Prevent FUTURE birthdays */
    const todayDate = new Date();
    const todayFormatted = todayDate.toISOString().split('T')[0];
    dobInput.setAttribute('max', todayFormatted);

    /* Auto display exact age immediately */
    dobInput.addEventListener('input', function () {
        if (!this.value) {
            ageInput.value = '';
            return;
        }

        const dob = new Date(this.value);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        ageInput.value = age + " years old";
    });


    /* =========================
       APPOINTMENT DATE SETTINGS
    ========================= */
    const appointmentDate = document.getElementById('appointmentDate');
    const dateError = document.getElementById('dateError');

    /* Prevent past dates */
    appointmentDate.setAttribute('min', todayFormatted);

    /* Block Sundays — parse as local time to avoid timezone bug */
    appointmentDate.addEventListener('input', function () {
        if (!this.value) return;

        const [year, month, day] = this.value.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);

        /* Sunday = 0 */
        if (selectedDate.getDay() === 0) {
            dateError.style.display = 'block';
            this.value = '';
        } else {
            dateError.style.display = 'none';
        }
    });


    /* =========================
       FORM SUBMISSION
    ========================= */
    document.getElementById('appointmentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const feedback = document.getElementById('formFeedback');

        /* Validate names */
        if (firstName.length < 2 || lastName.length < 2) {
            feedback.style.color = "red";
            feedback.textContent = "Please enter your complete first and last name.";
            return;
        }

        /* Block Sundays on submit too */
        if (appointmentDate.value) {
            const [year, month, day] = appointmentDate.value.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);

            if (selectedDate.getDay() === 0) {
                feedback.style.color = "red";
                feedback.textContent = "Clinic is closed on Sundays. Please choose another date.";
                return;
            }
        }

        /* Success */
        feedback.style.color = "#8458b3";
        feedback.style.marginTop = '15px';
        feedback.style.fontWeight = 'bold';
        feedback.style.textAlign = 'center';
        feedback.textContent = `✅ Thank you, ${firstName}! Your request has been submitted successfully.`;

        this.reset();

        /* Clear auto fields after reset */
        ageInput.value = '';
        dateError.style.display = 'none';
    });

}); // ← closes DOMContentLoaded