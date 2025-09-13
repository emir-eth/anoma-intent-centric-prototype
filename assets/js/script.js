// Mages of Anoma - Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Chain selector functionality
    const chainOptions = document.querySelectorAll('.chain-option');
    chainOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.parentElement;
            const siblings = parent.querySelectorAll('.chain-option');
            
            // Remove active class from siblings
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Update fee when chain selection changes
            const amount = amountInput.value;
            const token = tokenSelect.value;
            updateFeeDisplay(amount, token);
        });
    });

    // Intent form interactions
    const intentType = document.getElementById('intent-type');
    const amountInput = document.getElementById('amount');
    const tokenSelect = document.getElementById('token');
    const castIntentBtn = document.querySelector('.cast-intent-btn');

    // Update intent preview based on form changes
    function updateIntentPreview() {
        const selectedIntent = intentType.value;
        const amount = amountInput.value;
        const token = tokenSelect.value;
        
        const flowSteps = document.querySelectorAll('.flow-step');
        const stepTexts = document.querySelectorAll('.step-text p');
        
        // Update intent description based on selection
        let intentDescription = '';
        switch(selectedIntent) {
            case 'swap':
                intentDescription = `User wants to swap ${amount || '0.00'} ${token} tokens`;
                break;
            case 'yield':
                intentDescription = `User wants to maximize yield with ${amount || '0.00'} ${token}`;
                break;
            case 'nft':
                intentDescription = `User wants to trade NFTs seamlessly`;
                break;
            case 'lend':
                intentDescription = `User wants to lend/borrow ${amount || '0.00'} ${token}`;
                break;
            case 'custom':
                intentDescription = `User has a custom intent with ${amount || '0.00'} ${token}`;
                break;
        }
        
        if (stepTexts[0]) {
            stepTexts[0].textContent = intentDescription;
        }
        
        // Update fee display
        updateFeeDisplay(amount, token);
    }

    // Network fee rates (XAN per transaction)
    const networkFees = {
        'ethereum': 0.0025,
        'polygon': 0.0008,
        'osmosis': 0.0006,
        'arbitrum': 0.0012,
        'optimism': 0.0015,
        'base': 0.0005,
        'avalanche': 0.0018,
        'bsc': 0.0003
    };

    // Update fee display based on selected networks, amount and token
    function updateFeeDisplay(amount, token) {
        const feeAmountElement = document.querySelector('.fee-amount');
        const fromChainElement = document.querySelector('.chain-option.active[data-chain]');
        const toChainElement = document.querySelector('.chain-option.active[data-chain]');
        
        if (feeAmountElement && fromChainElement && toChainElement) {
            const fromChain = fromChainElement.getAttribute('data-chain');
            const toChain = toChainElement.getAttribute('data-chain');
            
            // Get base fee for the destination chain
            let baseFee = networkFees[toChain] || 0.001;
            let bridgeFee = 0;
            
            // Add cross-chain fee if different networks
            if (fromChain !== toChain) {
                bridgeFee = 0.0005; // Cross-chain bridge fee
            }
            
            // Add amount-based fee (0.05% of amount, minimum 0.0001 XAN)
            const amountNum = parseFloat(amount) || 0;
            const amountFee = Math.max(0.0001, amountNum * 0.0005);
            
            const totalFee = baseFee + bridgeFee + amountFee;
            
            // Update fee breakdown
            const baseFeeElement = document.getElementById('base-fee');
            const bridgeFeeElement = document.getElementById('bridge-fee');
            const amountFeeElement = document.getElementById('amount-fee');
            
            if (baseFeeElement) baseFeeElement.textContent = `${baseFee.toFixed(4)} XAN`;
            if (amountFeeElement) amountFeeElement.textContent = `${amountFee.toFixed(4)} XAN`;
            
            // Show/hide bridge fee
            if (bridgeFeeElement) {
                if (bridgeFee > 0) {
                    bridgeFeeElement.style.display = 'flex';
                    bridgeFeeElement.querySelector('.fee-value').textContent = `${bridgeFee.toFixed(4)} XAN`;
                } else {
                    bridgeFeeElement.style.display = 'none';
                }
            }
            
            // Add smooth animation
            feeAmountElement.style.opacity = '0.5';
            setTimeout(() => {
                feeAmountElement.textContent = `${totalFee.toFixed(4)} XAN`;
                feeAmountElement.style.opacity = '1';
            }, 150);
        }
    }

    // Add event listeners for form updates
    intentType.addEventListener('change', updateIntentPreview);
    amountInput.addEventListener('input', updateIntentPreview);
    tokenSelect.addEventListener('change', updateIntentPreview);

    // Cast intent button functionality
    castIntentBtn.addEventListener('click', function() {
        const amount = amountInput.value;
        const token = tokenSelect.value;
        const intentType = document.getElementById('intent-type').value;
        
        if (!amount || amount <= 0) {
            showNotification('Please enter a valid amount!', 'error');
            return;
        }
        
        // Add loading state
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Casting Spell...';
        this.disabled = true;
        
        // Simulate intent processing
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-check"></i> Intent Cast!';
            this.style.background = 'linear-gradient(45deg, #4ecdc4, #45b7d1)';
            
            // Show success animation
            showIntentAnimation();
            
            // Reset button after delay
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-magic"></i> Cast Intent Spell';
                this.disabled = false;
                this.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
            }, 3000);
        }, 2000);
    });

    // Intent processing animation
    function showIntentAnimation() {
        const flowSteps = document.querySelectorAll('.flow-step');
        const stepIcons = document.querySelectorAll('.step-icon');
        
        // Animate each step
        flowSteps.forEach((step, index) => {
            setTimeout(() => {
                step.style.background = 'rgba(78, 205, 196, 0.2)';
                step.style.border = '1px solid #4ecdc4';
                step.style.transform = 'scale(1.05)';
                
                // Add sparkle effect
                if (stepIcons[index]) {
                    stepIcons[index].style.animation = 'step-pulse 0.5s ease-in-out 3';
                }
                
                // Reset after animation
                setTimeout(() => {
                    step.style.transform = 'scale(1)';
                }, 500);
            }, index * 1000);
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? 'linear-gradient(45deg, #ff6b6b, #ff8e8e)' : 'linear-gradient(45deg, #4ecdc4, #45b7d1)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Magic button hover effects
    const magicButtons = document.querySelectorAll('.magic-btn, .btn-primary');
    magicButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Quest card hover effects
    const questCards = document.querySelectorAll('.quest-card');
    questCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Social link interactions
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const magicOrb = document.querySelector('.magic-orb');
        
        if (hero && magicOrb) {
            const rate = scrolled * -0.5;
            magicOrb.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.quest-card, .reward-item, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add sparkle effect to magic symbols
    const magicSymbols = document.querySelectorAll('.magic-symbol, .symbol');
    magicSymbols.forEach(symbol => {
        symbol.addEventListener('mouseenter', function() {
            this.style.animation = 'symbol-pulse 0.5s ease-in-out 3';
        });
    });

    // Initialize with welcome message
    setTimeout(() => {
        showNotification('Welcome to the Mages of Anoma! 🔮', 'info');
    }, 1000);

    // Initialize XAN as default token and update fee display
    tokenSelect.value = 'XAN';
    updateFeeDisplay(amountInput.value, 'XAN');

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to cast intent
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const castBtn = document.querySelector('.cast-intent-btn');
            if (castBtn && !castBtn.disabled) {
                castBtn.click();
            }
        }
        
        // Escape to clear form
        if (e.key === 'Escape') {
            document.getElementById('amount').value = '';
            updateIntentPreview();
        }
    });

    // Add form validation
    amountInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (value < 0) {
            this.value = '';
            showNotification('Amount cannot be negative!', 'error');
        }
    });

    // Add loading states for external links
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            showNotification('Opening external link...', 'info');
        });
    });

   
});
