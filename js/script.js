// js/script.js
document.addEventListener('DOMContentLoaded', () => {
  // Функция для сохранения предпочитаемого языка
  const saveLanguagePreference = (lang) => {
    localStorage.setItem('preferred-language', lang);
  };

  // Функция для получения сохранённого языка
  const getLanguagePreference = () => {
    return localStorage.getItem('preferred-language');
  };

  // Определяем текущий язык по URL
  const getCurrentLanguage = () => {
    if (window.location.pathname.includes('index-ru.html')) {
      return 'ru';
    }
    return 'uk'; // украинский по умолчанию
  };

  const currentLang = getCurrentLanguage();
  saveLanguagePreference(currentLang);

  // Order form toggle
  const orderButton = document.getElementById('orderButton');
  const orderForm = document.getElementById('orderForm');
  const mainOrderForm = document.getElementById('mainOrderForm');

  if (orderButton && orderForm) {
    // Toggle form on button click
    orderButton.addEventListener('click', (e) => {
      e.stopPropagation();
      orderForm.classList.toggle('show');
    });

    // Close form when clicking outside
    document.addEventListener('click', (e) => {
      if (!orderForm.contains(e.target) && e.target !== orderButton) {
        orderForm.classList.remove('show');
      }
    });

    // Prevent form close when clicking inside
    orderForm.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Form submission
  if (mainOrderForm) {
    // Функция для получения данных формы
    const getFormData = () => {
      const task = mainOrderForm.querySelector('[name="task"]').value.trim();
      const urgency = mainOrderForm.querySelector('[name="urgency"]').value;
      const address = mainOrderForm.querySelector('[name="address"]').value.trim();
      const phone = mainOrderForm.querySelector('[name="phone"]').value.trim();
      const additionalInfo = mainOrderForm.querySelector('[name="additional_info"]').value.trim();
      
      return { task, urgency, address, phone, additionalInfo };
    };

    // Функция валидации
    const validateForm = () => {
      const { task, phone } = getFormData();
      
      if (!task) {
        const errorMessage = currentLang === 'ru' ? 'Пожалуйста, укажите что нужно сделать' : 'Будь ласка, вкажіть що потрібно зробити';
        alert(errorMessage);
        return false;
      }
      
      if (!phone) {
        const errorMessage = currentLang === 'ru' ? 'Пожалуйста, укажите номер телефона' : 'Будь ласка, вкажіть номер телефону';
        alert(errorMessage);
        return false;
      }
      
      return true;
    };

    // Функция формирования текста сообщения
    const formatMessage = () => {
      const { task, urgency, address, phone, additionalInfo } = getFormData();
      const title = currentLang === 'ru' ? 'Новая заявка с сайта' : 'Нова заявка з сайту';
      const labels = currentLang === 'ru' 
        ? {
            task: 'Что нужно сделать',
            urgency: 'Срочность',
            address: 'Адрес',
            phone: 'Телефон',
            additional: 'Дополнительная информация'
          }
        : {
            task: 'Що потрібно зробити',
            urgency: 'Терміновість',
            address: 'Адреса',
            phone: 'Телефон',
            additional: 'Додаткова інформація'
          };
      
      let message = `${title}\n\n`;
      message += `${labels.task}:\n${task}\n\n`;
      message += `${labels.urgency}:\n${urgency}\n\n`;
      message += `${labels.address}:\n${address}\n\n`;
      message += `${labels.phone}:\n${phone}`;
      
      if (additionalInfo) {
        message += `\n\n${labels.additional}:\n${additionalInfo}`;
      }
      
      return message;
    };

    // Обработчик Telegram
    const sendTelegramButton = document.getElementById('sendTelegram');
    if (sendTelegramButton) {
      sendTelegramButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const message = formatMessage();
        const encodedMessage = encodeURIComponent(message);
        
        // Открываем прямой чат в Telegram с @gsk71227 с предзаполненным сообщением
        const telegramUrl = `https://t.me/gsk71227?text=${encodedMessage}`;
        window.open(telegramUrl, '_blank');
        
        // Закрываем форму после открытия Telegram
        setTimeout(() => {
          orderForm.classList.remove('show');
        }, 500);
      });
    }

    // Обработчик Viber
    const sendViberButton = document.getElementById('sendViber');
    if (sendViberButton) {
      sendViberButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const message = formatMessage();
        const encodedMessage = encodeURIComponent(message);
        
        // Используем официальный механизм Share
        const viberUrl = `https://www.viber.com/share?text=${encodedMessage}`;
        window.open(viberUrl, '_blank');
        
        // Закрываем форму после открытия Viber
        setTimeout(() => {
          orderForm.classList.remove('show');
        }, 500);
      });
    }

    // Обработчик Email - НОВЫЙ КОД (mailto:)
    const sendEmailButton = document.getElementById('sendEmail');
    if (sendEmailButton) {
      sendEmailButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const { task, urgency, address, phone, additionalInfo } = getFormData();
        
        // Email получателя
        const recipientEmail = 'info71227@gmail.com';
        
        // Тема письма
        const subject = currentLang === 'ru' ? 'Новая заявка с сайта' : 'Нова заявка з сайту';
        
        // Тело письма
        const labels = currentLang === 'ru' 
          ? {
              task: 'Что нужно сделать',
              urgency: 'Срочность',
              address: 'Адрес',
              phone: 'Телефон',
              additional: 'Дополнительная информация'
            }
          : {
              task: 'Що потрібно зробити',
              urgency: 'Терміновість',
              address: 'Адреса',
              phone: 'Телефон',
              additional: 'Додаткова інформація'
            };
        
        let body = `${labels.task}: ${task}\n\n`;
        body += `${labels.urgency}: ${urgency}\n\n`;
        body += `${labels.address}: ${address}\n\n`;
        body += `${labels.phone}: ${phone}`;
        
        if (additionalInfo) {
          body += `\n\n${labels.additional}: ${additionalInfo}`;
        }
        
        // Создаём mailto ссылку
        const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Открываем почтовый клиент
        window.location.href = mailtoUrl;
        
        // Закрываем форму после открытия email клиента
        setTimeout(() => {
          orderForm.classList.remove('show');
        }, 500);
      });
    }
  }

  // Автоматический слайдер изображений
  const slides = document.querySelectorAll('.slider-image');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    const slideInterval = 4000; // Интервал смены слайдов (4 секунды)
    
    function showSlide(index) {
      // Убираем active со всех слайдов
      slides.forEach(slide => {
        slide.classList.remove('active');
      });
      
      // Добавляем active к текущему слайду
      slides[index].classList.add('active');
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }
    
    // Запускаем автоматическую смену слайдов
    setInterval(nextSlide, slideInterval);
    
    // Показываем первый слайд
    showSlide(currentSlide);
  }
});