// Interactivity logic for Campus Sicherheit

// Webhook-URL für Make.com (hier Ihre tatsächliche Webhook-URL eintragen)
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/5puh5s8vqjuhnvpn1sakfowd6b3uhokg';

document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger animation if needed
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
        });
    }

    // Modal control for Job Applications
    const modal = document.getElementById('apply-modal');
    const modalClose = document.getElementById('modal-close');
    const applyButtons = document.querySelectorAll('.apply-btn');
    const applyJobTitle = document.getElementById('apply-job-title');
    const jobTitleInput = document.getElementById('job-title-input');

    if (modal) {
        applyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const jobTitle = btn.getAttribute('data-job') || 'Sicherheitsfachkraft';
                if (applyJobTitle) applyJobTitle.textContent = jobTitle;
                if (jobTitleInput) jobTitleInput.value = jobTitle;
                modal.style.display = 'flex';
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close on background click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Interactive Job Search
    const searchInput = document.getElementById('job-search');
    const jobItems = document.querySelectorAll('.job-item');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            jobItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const locations = item.querySelector('.job-meta').textContent.toLowerCase();

                if (title.includes(query) || locations.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Collapsible Accordions (Datenschutz)
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });

    // File Upload naming helper
    const fileInput = document.getElementById('cv-file');
    const fileLabelText = document.getElementById('file-upload-text');

    if (fileInput && fileLabelText) {
        fileInput.addEventListener('change', (e) => {
            if (fileInput.files.length > 0) {
                fileLabelText.textContent = `Ausgewählt: ${fileInput.files[0].name}`;
                fileLabelText.style.color = '#d6b779';
            }
        });
    }

    // Form submission simulation
    const forms = document.querySelectorAll('form:not(#indeed-empfang-form)');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show premium animated checkmark success or alert
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Absenden';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Wird gesendet...';
            }

            setTimeout(() => {
                if (modal) modal.style.display = 'none';
                
                // Show floating banner success notification
                const successBanner = document.createElement('div');
                successBanner.style.position = 'fixed';
                successBanner.style.bottom = '20px';
                successBanner.style.right = '20px';
                successBanner.style.backgroundColor = '#d6b779';
                successBanner.style.color = '#0f1216';
                successBanner.style.padding = '1rem 2rem';
                successBanner.style.borderRadius = '8px';
                successBanner.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
                successBanner.style.zIndex = '3000';
                successBanner.style.fontWeight = 'bold';
                successBanner.style.fontFamily = 'sans-serif';
                successBanner.style.transition = 'all 0.5s ease';
                successBanner.textContent = 'Bewerbung erfolgreich gesendet!';
                
                document.body.appendChild(successBanner);

                setTimeout(() => {
                    successBanner.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(successBanner);
                    }, 500);
                }, 4000);

                // Send event to Google Analytics
                if (typeof gtag === 'function') {
                    const jobTitleVal = jobTitleInput ? jobTitleInput.value : 'Allgemeine Bewerbung';
                    gtag('event', 'bewerbung_abgesendet', {
                        'job_title': jobTitleVal,
                        'arbeitsort': 'Allgemein'
                    });
                }

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                form.reset();
                if (fileLabelText) fileLabelText.textContent = 'Lebenslauf auswählen (nur PDF)';
            }, 1500);
        });
    });

    // Cookie Banner Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (cookieBanner && cookieAccept && cookieDecline) {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // Helper to show success/error notification
    function showNotification(message, isError = false) {
        const successBanner = document.createElement('div');
        successBanner.style.position = 'fixed';
        successBanner.style.bottom = '20px';
        successBanner.style.right = '20px';
        successBanner.style.backgroundColor = isError ? '#e74c3c' : '#d6b779';
        successBanner.style.color = '#0f1216';
        successBanner.style.padding = '1rem 2rem';
        successBanner.style.borderRadius = '8px';
        successBanner.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
        successBanner.style.zIndex = '3000';
        successBanner.style.fontWeight = 'bold';
        successBanner.style.fontFamily = 'sans-serif';
        successBanner.style.transition = 'all 0.5s ease';
        successBanner.textContent = message;
        
        document.body.appendChild(successBanner);

        setTimeout(() => {
            successBanner.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(successBanner)) {
                    document.body.removeChild(successBanner);
                }
            }, 500);
        }, 4000);
    }

    // Indeed-Empfang Form Handler (Connect to Make.com Webhook)
    const indeedForm = document.getElementById('indeed-empfang-form');
    if (indeedForm) {
        indeedForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = indeedForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Bewerbung absenden';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Wird gesendet...';
            }

            const fileInput = document.getElementById('cv-file');
            const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;

            const sendPayload = (base64Data = null, fileName = null) => {
                const payload = {
                    vorname: document.getElementById('vorname').value,
                    nachname: document.getElementById('nachname').value,
                    email: document.getElementById('email').value,
                    telefon: document.getElementById('telefon').value,
                    strasse: document.getElementById('strasse').value,
                    hausnummer: document.getElementById('hausnummer').value,
                    plz: document.getElementById('plz').value,
                    ort: document.getElementById('ort').value,
                    sachkunde: document.getElementById('sachkunde').value,
                    arbeit: document.getElementById('arbeit').value,
                    gemeldet: document.getElementById('gemeldet').value,
                    lebenslauf_base64: base64Data,
                    lebenslauf_name: fileName,
                    datenschutz_akzeptiert: document.getElementById('datenschutz-optin') ? document.getElementById('datenschutz-optin').checked : false,
                    kontakt_akzeptiert: document.getElementById('kontakt-optin') ? document.getElementById('kontakt-optin').checked : false,
                    stelle: document.getElementById('job-title') ? document.getElementById('job-title').value : 'Quereinsteiger (m/w/d) Fahrkartenkontrolleur',
                    arbeitsort: document.getElementById('arbeitsort') ? document.getElementById('arbeitsort').value : 'Hamburg'
                };

                fetch(MAKE_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => {
                    if (response.ok) {
                        showNotification('Bewerbung erfolgreich gesendet!');
                        
                        // Send event to Google Analytics
                        if (typeof gtag === 'function') {
                            gtag('event', 'bewerbung_abgesendet', {
                                'job_title': payload.stelle,
                                'arbeitsort': payload.arbeitsort
                            });
                        }

                        indeedForm.reset();
                        const fileLabelText = document.getElementById('file-upload-text');
                        if (fileLabelText) {
                            fileLabelText.textContent = 'Lebenslauf hochladen (nur PDF)';
                            fileLabelText.style.color = 'var(--text-gray)';
                        }
                        
                        // Show success confirmation modal
                        const successModal = document.getElementById('success-modal');
                        if (successModal) {
                            successModal.style.display = 'flex';
                        }
                    } else {
                        showNotification('Fehler beim Senden. Bitte erneut versuchen.', true);
                    }
                })
                .catch(error => {
                    console.error('Webhook submission error:', error);
                    showNotification('Verbindungsfehler zum Server. Bitte erneut versuchen.', true);
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                });
            };

            if (file) {
                const reader = new FileReader();
                reader.onload = function() {
                    // Get base64 string without data:application/pdf;base64, prefix
                    const base64String = reader.result.split(',')[1];
                    sendPayload(base64String, file.name);
                };
                reader.onerror = function() {
                    console.error('File reading error');
                    showNotification('Fehler beim Lesen des Lebenslaufs.', true);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                };
                reader.readAsDataURL(file);
            } else {
                sendPayload();
            }
        });
    }

    // Success Modal Close Actions
    const successModal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('success-modal-close-btn');
    const closeAction = document.getElementById('success-modal-close-action');

    const closeSuccessModal = () => {
        if (successModal) {
            successModal.style.display = 'none';
        }
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSuccessModal);
    }
    if (closeAction) {
        closeAction.addEventListener('click', closeSuccessModal);
    }
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeSuccessModal();
            }
        });
    }
});

