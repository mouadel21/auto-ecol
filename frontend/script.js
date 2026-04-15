// 4. Contact Form Backend Integration
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const feedbackMsg = document.createElement("div");
  feedbackMsg.style.display = "none";
  feedbackMsg.style.padding = "15px";
  feedbackMsg.style.marginTop = "20px";
  feedbackMsg.style.borderRadius = "10px";
  feedbackMsg.style.fontWeight = "600";
  feedbackMsg.style.backdropFilter = "blur(10px)";
  contactForm.appendChild(feedbackMsg);

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn.innerHTML;
    const currentLang = document.documentElement.getAttribute("lang");

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      currentLang === "fr" ? "Traitement... ⏳" : "جاري المعالجة... ⏳";

    const data = {
      name: document.getElementById("nom").value,
      phone: document.getElementById("telephone").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };

    feedbackMsg.style.display = "none";

    try {
      const response = await fetch(
        "https://auto-ecol-production.up.railway.app/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (response.ok) {
        feedbackMsg.textContent =
          currentLang === "fr"
            ? "Message envoyé avec succès ! 🚀"
            : "تم إرسال الرسالة بنجاح! 🚀";

        feedbackMsg.style.background = "rgba(34, 197, 94, 0.2)";
        feedbackMsg.style.color = "#4ade80";
        feedbackMsg.style.border = "1px solid rgba(34, 197, 94, 0.3)";
        feedbackMsg.style.display = "block";

        contactForm.reset();
      } else {
        throw new Error(result.error || "Server error");
      }
    } catch (error) {
      feedbackMsg.textContent =
        currentLang === "fr"
          ? "Erreur de connexion au serveur ❌"
          : "خطأ في الاتصال بالخادم ❌";

      feedbackMsg.style.background = "rgba(239, 68, 68, 0.2)";
      feedbackMsg.style.color = "#f87171";
      feedbackMsg.style.border = "1px solid rgba(239, 68, 68, 0.3)";
      feedbackMsg.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });
}
