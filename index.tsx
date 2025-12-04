const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
const sfx = {
    playTone(freq, type, duration, vol=0.1) {
        if(audioCtx.state==='suspended') audioCtx.resume();
        const o=audioCtx.createOscillator(), g=audioCtx.createGain();
        o.type=type as any; o.frequency.setValueAtTime(freq,audioCtx.currentTime);
        g.gain.setValueAtTime(vol,audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01,audioCtx.currentTime+duration);
        o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+duration);
    },
    chill: () => { if(audioCtx.state==='suspended') audioCtx.resume(); const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.type='sawtooth'; o.frequency.setValueAtTime(50,audioCtx.currentTime); g.gain.setValueAtTime(0.2,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+3); o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+3); },
    roll: () => { for(let i=0;i<10;i++) setTimeout(()=>sfx.playTone(200+Math.random()*500,'square',0.05,0.05),i*50); },
    move: () => { sfx.playTone(300,'sine',0.1); setTimeout(()=>sfx.playTone(450,'sine',0.1),50); },
    fall: () => { const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.frequency.setValueAtTime(800,audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(100,audioCtx.currentTime+1); g.gain.linearRampToValueAtTime(0,audioCtx.currentTime+1); o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+1); },
    itemGood: () => { sfx.playTone(600,'sine',0.1); setTimeout(()=>sfx.playTone(900,'sine',0.2),100); },
    itemBad: () => sfx.playTone(150,'sawtooth',0.4),
    hitLow: () => sfx.playTone(200,'square',0.1),
    hitMed: () => sfx.playTone(150,'sawtooth',0.15),
    hitHigh: () => { sfx.playTone(100,'sawtooth',0.2); setTimeout(()=>sfx.playTone(50,'sawtooth',0.3),100); },
    damageTaken: () => { sfx.playTone(100,'square',0.3); setTimeout(()=>sfx.playTone(8,'square',0.3),150); },
    dodge: () => { const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.frequency.setValueAtTime(600,audioCtx.currentTime); o.frequency.linearRampToValueAtTime(200,audioCtx.currentTime+0.2); g.gain.value=0.1; o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+0.2); },
    crit: () => { for(let i=0;i<3;i++) setTimeout(()=>sfx.playTone(1000,'square',0.1,0.2),i*100); },
    tickle: () => { for(let i=0;i<5;i++) setTimeout(()=>sfx.playTone(800+Math.random()*200,'sine',0.1),i*80); },
    win: () => { [261,329,392,523].forEach((f,i)=>setTimeout(()=>sfx.playTone(f,'triangle',0.5,0.3),i*150)); },
    lore: () => { sfx.playTone(400,'sine',1.5,0.05); }
};

const LORE = {
    intro: "Darkness... then a blinding light. You hear a flatline. You aren't in the hospital anymore. You are at the foot of an infinite ladder. A voice echoes: 'This is the Test.'",
    20: "MEMORY RECOVERED (Step 20): A flash of headlights. The screech of tires. You were driving home to see your mother. You never made it.",
    40: "MEMORY RECOVERED (Step 40): You remember your job. High stress, low pay. You always wanted to travel. You promised yourself 'next year'. There are no next years here.",
    60: "MEMORY RECOVERED (Step 60): 'This is the climb of Penance.' You weren't perfect, but you weren't evil. To reach the light, you must rise above the filth.",
    80: "MEMORY RECOVERED (Step 80): The pain of the crash is fading. You remember the faces of those you loved. They are crying, but you feel... peace? You are close now.",
    hasina: "THE IRON LADY'S FATE: She ruled with an iron fist, silencing thousands to keep her throne. The blood of the students turned into the very chains that bind her here. She acts as a gatekeeper, forever denied ascension because she refuses to repent.",
    diddy: "THE PARTY KING'S FATE: He thought fame granted immunity. Now he is the prisoner, slipping on his own oil, forever trapped diddling in eternal hell.",
    bandit: "THE ONE WHO WAS THE PROMISED TO HAVE THE WORLD: Once a climber like you, he succumbed to greed. He preys on others, Thinking money will allow him into heaven. He doesn't realize money has no value up here.",
    logan: "THE INFLUENCER'S PURGATORY: He sold a dream that didn't exist. Now he wanders this step, boxing shadows and chugging radioactive energy drinks, begging for one last like. His camera is broken, but he still vlogs to the void.",
    elon: "THE TECH BARON'S EXILE: He wanted to go to Mars, but his ego weighed him down. He rules this step with a jagged X, firing anyone who makes eye contact. He bought this step, but he can't buy a way out.",
    zuck: "THE REPTILE'S DEN: A hollow shell seeking human connection but finding only data points. He knows your secrets, your fears, and your browser history. He blocked you from heaven.",
    trump: "THE ORANGE TYCOON: He claims he won the ladder. He says the steps are rigged. He built a golden tower on step 90 and demands a tariff to pass. He has the best words, but uses them to deport you.",
    guardian: "THE SINNED GUARDIAN: An angel who flew too close to the sun of pride. Cast down to the threshold, he guards the gate to ensure only those stronger than him can enter. He envies your mortality."
};

const TAUNTS = {
    intro: ["Welcome to hell. Enjoy the climb.", "Good luck. You'll need it.", "Oh, another one? How boring."],
    roll_low: ["One? Pathetic.", "Try harder.", "My grandma rolls better.", "Why do you even try?", "Embarrassing."],
    roll_high: ["Pure luck, no skill.", "Don't get used to it.", "Wow, you actually moved."],
    fall: ["Going down?", "Back to the start, loser.", "Gravity is a harsh mistress.", "See you at the bottom.", "Bye bye!"],
    damage: ["That looked painful.", "Stop bleeding on the floor.", "You're dying. Good.", "Ouch. Do it again."],
    trap_shit: ["Eww, stepped in it.", "You smell like failure.", "Fitting place for you."],
    trap_mud: ["Stuck? Good.", "Wallow in the filth.", "Enjoy the mud bath."],
    trap_egg: ["Rotten egg for a rotten player.", "Stinks, doesn't it?"],
    boss_start: ["You are not prepared.", "He looks angry.", "This is the end for you.", "Prepare to die."],
    boss_hit_player: ["You got slapped.", "Embarrassing performance.", "Dodge next time?", "Stop face-tanking."],
    boss_hit_boss: ["You poked him.", "Is that all you got?", "He barely felt that."],
    player_miss: ["You missed? Are you blind?", "Swing and a miss.", "Air has feelings too.", "Pathetic aim."],
    win: ["You actually won? Glitch.", "Must be a bug.", "Hacker.", "Whatever."],
    item: ["Greedy little pig.", "It won't save you.", "Ooh shiny object.", "Don't choke on it."],
    
    // Specific Pickup Taunts
    pickup_gaja: ["Gaja? Really? Trying to fly high?", "Don't forget to pass it.", "Great, now you'll be hungry and slow."],
    pickup_magic: ["Oh, you want to control fate? Cute.", "Cheater's favorite toy.", "Rigging the game, are we?"],
    pickup_chili: ["Spice it up. Prepare your stomach.", "That's gonna burn twice.", "Hot stuff coming through."],
    pickup_potion: ["Drink it. I dare you.", "Mystery juice. Probably poison.", "Science experiment time."],
    pickup_wire: ["Shocking discovery.", "Don't electrocute yourself.", "Power to the player... literally."],
    pickup_mojo: ["Sugary death in a bottle.", "Enjoy the diabetes.", "Refreshing, but deadly."],
    pickup_roafja: ["Sweet red syrup. Sticky.", "Saving it for Iftar?", "Thirsty much?"],

    // Context Aware Boss Taunts
    boss_hasina: ["She's looking for a visa. Don't give it to her.", "Hide the helicopters!", "She screams 'Resign' but hears nothing.", "The Queen of Iron is here."],
    boss_diddy: ["Hide the baby oil.", "No parties allowed here.", "He wants to show you a 'good time'. Run.", "Freak off initiated."],
    boss_bandit: ["Hide your wallet.", "He smells your loose change.", "Interest rates just went up.", "He wants his pound of flesh."],
    boss_logan: ["Don't subscribe to his channel.", "Is that a dead body in the forest?", "He's filming an apology video right now.", "Prime energy tastes like battery acid."],
    boss_elon: ["He's going to fire you.", "Concerning.", "Look into it.", "He's strictly hardcore.", "Your account has been suspended."],
    boss_zuck: ["He's blinking sideways.", "Sweet Baby Rays.", "He's harvesting your data.", "Welcome to the Metaverse.", "You cannot block him."],
    boss_trump: ["I will build a great, great wall.", "You are fake news.", "China!", "I have the best brain.", "Make Ludo Great Again.", "Covfefe."],
    boss_trump_hit: ["Wrong!", "Nasty woman.", "I know more about taking damage than anyone.", "Fake news attack.", "They are treating me very unfairly."],
    boss_guardian: ["The gatekeeper is awake.", "You shall not pass!", "He thinks he's better than you. He is."],

    use_gaja: ["Don't get too high now."],
    use_mojo: ["You will get diabetes."],
    use_roafja: ["Roja rakhos beta?"],
    death_fall: ["Nice trip. See you next incarnation.", "Gravity checks out.", "Into the abyss with you.", "Did you forget how to walk?", "Splat. Clean up on aisle 1."],
    death_damage: ["You died. How original.", "Health gone, brain gone.", "Bleeding out looks good on you.", "Try dodging next time.", "Wasted."],
    death_boss: ["He mopped the floor with you.", "Embarrassing boss fight.", "You let HIM beat you? Wow.", "Fatality. You lose."]
};

const game = {
    step: 0, hp: 100, doubleRollTurns: 0, curseDuration: 0, banditBribed: false,
    bossState: { active: false, id: null, hp: 100, maxHp: 100, triggered: { hasina: false, diddy: false, bandit: false, logan: false, elon: false, zuck: false, trump: false, guardian: false, bandit2: false }, counterActive: false, stunned: 0, noDodge: 0 },
    inv: { gaja: 0, magic: 0, chili: 0, potion: 0, wire: 0, mojo: 0, roafja: 0 },
    memoriesTriggered: [],
    voiceEnabled: false,
    isMoving: false, // LOCK FOR ROLL SPAMMING
    currentBossAudio: null,
    bossAudioPath: null,

    els: {
        track: document.getElementById('ladderTrack'), log: document.getElementById('gameLog'),
        hpBar: document.getElementById('hpBar'), hpVal: document.getElementById('hpVal'), stepVal: document.getElementById('stepVal'),
        bossModal: document.getElementById('bossModal'), bossHpBar: document.getElementById('modalBossBar'),
        bossPlayerHpBar: document.getElementById('modalPlayerBar'), modalPlayerHp: document.getElementById('modalPlayerHp'),
        modalBossHp: document.getElementById('modalBossHp'), bossLog: document.getElementById('bossLogArea'),
        gameOver: document.getElementById('gameOverModal'), winModal: document.getElementById('winModal'),
        infoModal: document.getElementById('infoModal'), invModal: document.getElementById('invModal'),
        loreModal: document.getElementById('loreModal'), loreText: document.getElementById('loreText'), loreTitle: document.getElementById('loreTitle'),
        bossLoreContainer: document.getElementById('bossLoreContainer'), bossBarsContainer: document.getElementById('bossBarsContainer'),
        bossLoreText: document.getElementById('bossLoreText'), bossPhase2: document.getElementById('bossPhase2'), bossPhase1: document.getElementById('bossPhase1'),
        bossTurnIndicator: document.getElementById('bossTurnIndicator'), bossRewardContainer: document.getElementById('bossRewardContainer'),
        buffIcon: document.getElementById('buffIcon'), curseIcon: document.getElementById('curseIcon'),
        pickupModal: document.getElementById('pickupModal'), pickupIcon: document.getElementById('pickupIcon'), pickupTitle: document.getElementById('pickupTitle'), pickupDesc: document.getElementById('pickupDesc'),
        bossStunStatus: document.getElementById('bossStunStatus'), bossDodgeStatus: document.getElementById('bossDodgeStatus'),
        btnVoice: document.getElementById('btnVoice'),
        testModal: document.getElementById('testModal'),
        passwordModal: document.getElementById('passwordModal'),
        devPasswordInput: document.getElementById('devPasswordInput') as HTMLInputElement,
        bossMusicStatus: document.getElementById('bossMusicStatus'),
        btnRetryMusic: document.getElementById('btnRetryMusic')
    },

    init() {
        setTimeout(() => {
            this.showLore("INTRO", LORE.intro);
            this.taunt('intro');
        }, 500);
        const items = { gaja: [4, 7, 15, 33, 72], magic: [25, 50, 90], chili: [12, 40, 82], potion: [28, 65, 95],
                        wire: [29, 39], mojo: [5,18,35,42,52,68,78,88,92,98], roafja: [14,26,48,62,84] };

        for (let i = 1; i <= 100; i++) {
            const div = document.createElement('div'); div.className = 'step'; div.id = `step-${i}`;
            let icon='', subtext='';
            if (items.gaja.includes(i)) { div.classList.add('item-gaja'); icon='🌿'; subtext='+/-7'; }
            else if (items.magic.includes(i)) { div.classList.add('item-magic'); icon='🎲'; subtext='Pick #'; }
            else if (items.chili.includes(i)) { div.classList.add('item-chili'); icon='🌶️'; subtext='Risk'; }
            else if (items.potion.includes(i)) { div.classList.add('item-potion'); icon='🧪'; subtext='?'; }
            else if (items.wire.includes(i)) { div.classList.add('item-wire'); icon='⚡'; subtext='STUN'; }
            else if (items.mojo.includes(i)) { div.classList.add('item-mojo'); icon='🥤'; subtext='+20HP'; }
            else if (items.roafja.includes(i)) { div.classList.add('item-roafja'); icon='🍷'; subtext='HIT'; }
            else if (i===8) { div.classList.add('trap-shit'); icon='💩'; subtext='-5'; }
            else if (i===10) { div.classList.add('boss-step'); icon='👹'; subtext='BOSS'; }
            else if (i===15) { div.classList.add('trap-mud'); icon='💩'; subtext='MUD'; }
            else if (i===20) { div.classList.add('boss-diddy'); icon='🧢'; subtext='BOSS'; }
            else if (i===22) { div.classList.add('trap-egg'); icon='🥚'; subtext='-10HP'; }
            else if (i===30) { div.classList.add('trap-bandit'); icon='✡️'; subtext='THE JEW'; }
            else if (i===40) { div.classList.add('boss-logan'); icon='🤳'; subtext='BOSS'; }
            else if (i===45) { div.classList.add('trap-idol'); icon='🗿'; subtext='CURSE OF JIN'; }
            else if (i===55) { div.classList.add('trap-hole'); icon='⚫'; subtext='RESET'; }
            else if (i===60) { div.classList.add('boss-elon'); icon='🚀'; subtext='BOSS'; }
            else if (i===75) { div.classList.add('trap-moss'); icon='🍂'; subtext='SLIDE'; }
            else if (i===80) { div.classList.add('boss-zuck'); icon='🦎'; subtext='BOSS'; }
            else if (i===85) { div.classList.add('trap-banana'); icon='🍌'; subtext='-10'; }
            else if (i===90) { div.classList.add('boss-trump'); icon='👱'; subtext='BOSS'; }
            else if (i===100) { div.classList.add('boss-guardian'); icon='👁️'; subtext='THE LAST STEP TO PEACE'; }
            div.innerHTML = `<div class="flex flex-col items-center w-12"><span class="text-[9px] text-gray-500">${i}</span><span class="text-[8px] text-gray-400 font-bold leading-tight uppercase text-center w-full">${subtext}</span></div><div class="player-slot flex-grow flex justify-center"></div><span class="text-xl w-8 text-right">${icon}</span>`;
            this.els.track.appendChild(div);
        }
        this.updateUI(); this.scrollToPlayer();
        this.updateVoiceUI();
    },

    toggleVoice() {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        this.voiceEnabled = !this.voiceEnabled;
        window.speechSynthesis.cancel();
        this.updateVoiceUI();
        if(this.voiceEnabled) this.log("AI Narrator Enabled.", "good");
    },

    updateVoiceUI() {
        this.els.btnVoice.innerText = this.voiceEnabled ? "🔊 AI VOICE: ON" : "🔇 AI VOICE: OFF";
        this.els.btnVoice.className = this.voiceEnabled 
            ? "col-span-2 bg-green-700 active:bg-green-600 text-white font-bold py-2 rounded border-b-4 border-green-900 active:border-b-0 active:translate-y-1 text-xs"
            : "col-span-2 bg-pink-700 active:bg-pink-600 text-white font-bold py-2 rounded border-b-4 border-pink-900 active:border-b-0 active:translate-y-1 text-xs";
    },

    taunt(category, overrideText = null) {
        if (!this.voiceEnabled) return;
        
        let text = "";
        if (overrideText) {
            text = overrideText;
        } else {
            const lines = TAUNTS[category] || ["..."];
            text = lines[Math.floor(Math.random() * lines.length)];
        }
        
        // Indicate voice speaking
        const log = this.els.log;
        const d = document.createElement('div');
        d.innerHTML = `🎙️ 🔊 <i>"${text}"</i>`;
        d.className = "text-purple-400 text-[10px] italic mb-1";
        log.appendChild(d);
        log.scrollTop = log.scrollHeight;

        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        
        // Attempt to select a better voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
            (v.name.includes("Google US English") || v.name.includes("Microsoft David") || v.name.includes("Samantha") || v.lang.startsWith("en-")) 
            && !v.name.includes("Zira")
        );
        if (preferredVoice) u.voice = preferredVoice;

        u.rate = 0.9 + Math.random() * 0.2; // More natural rate variation
        u.pitch = 0.95 + Math.random() * 0.1; // More natural pitch
        u.volume = 1.0;
        window.speechSynthesis.speak(u);
    },

    playBossMusic(bossId) {
        this.stopBossMusic();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        let filename = bossId;
        if (bossId === 'bandit2') filename = 'bandit';
        
        // Ensure lowercase for simple servers
        const path = filename.toLowerCase() + ".mp3"; 
        this.bossAudioPath = path;

        if (this.els.bossMusicStatus) {
            this.els.bossMusicStatus.innerText = "🎵 Loading " + path + "...";
            this.els.bossMusicStatus.style.color = "#9ca3af";
        }
        
        // Hide retry button initially
        if(this.els.btnRetryMusic) this.els.btnRetryMusic.classList.add('hidden');

        const audio = new Audio(path);
        audio.loop = true;
        audio.volume = 1.0; // Default volume (100%)
        
        // Debug listeners
        audio.addEventListener('error', (e) => {
            console.error(`[AUDIO] Failed to load ${path}. Check file existence/path. Error:`, e);
            if (this.els.bossMusicStatus) {
                this.els.bossMusicStatus.innerText = "❌ ERROR: " + path + " not found";
                this.els.bossMusicStatus.style.color = "#ef4444";
            }
        });
        audio.addEventListener('playing', () => {
            console.log(`[AUDIO] Now playing: ${path}`);
            if (this.els.bossMusicStatus) {
                this.els.bossMusicStatus.innerText = "🎵 Playing: " + path;
                this.els.bossMusicStatus.style.color = "#4ade80";
            }
        });

        this.currentBossAudio = audio;
        
        // Load and play
        audio.load();
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn(`[AUDIO] Play promise rejected for ${path}. Interaction required?`, error);
                if (this.els.bossMusicStatus) {
                    this.els.bossMusicStatus.innerText = "⚠️ Blocked by Browser";
                    this.els.bossMusicStatus.style.color = "#facc15";
                }
                // Show retry button
                if(this.els.btnRetryMusic) {
                    this.els.btnRetryMusic.classList.remove('hidden');
                }
            });
        }
    },
    
    retryMusic() {
        if (this.currentBossAudio) {
            this.currentBossAudio.play().catch(e => console.error(e));
        } else if (this.bossState.active && this.bossState.id) {
            this.playBossMusic(this.bossState.id === 'bandit2' ? 'bandit' : this.bossState.id);
        }
    },

    stopBossMusic() {
        if (this.currentBossAudio) {
            this.currentBossAudio.pause();
            this.currentBossAudio.currentTime = 0; // Reset
            this.currentBossAudio = null;
        }
        if (this.els.bossMusicStatus) this.els.bossMusicStatus.innerText = "";
        if(this.els.btnRetryMusic) this.els.btnRetryMusic.classList.add('hidden');
    },

    resetGame() {
        this.stopBossMusic();
        this.step=0; this.hp=100; this.doubleRollTurns=0; this.curseDuration=0; this.banditBribed=false;
        this.inv={gaja:0,magic:0,chili:0,potion:0,wire:0,mojo:0,roafja:0};
        this.bossState={active:false,id:null,hp:100,maxHp:100,triggered:{hasina:false,diddy:false,bandit:false,logan:false,elon:false,zuck:false,trump:false,guardian:false,bandit2:false},counterActive:false,stunned:0,noDodge:0};
        this.memoriesTriggered = [];
        this.isMoving = false;
        this.els.gameOver.classList.add('hidden'); this.els.winModal.classList.add('hidden');
        this.els.bossModal.classList.add('hidden'); this.els.invModal.classList.add('hidden');
        this.els.log.innerHTML=''; 
        setTimeout(() => {
            this.showLore("INTRO", LORE.intro);
            this.taunt('intro');
        }, 500);
        this.updateUI(); this.scrollToPlayer();
    },

    log(msg, type) { const d=document.createElement('div'); d.innerText=`> ${msg}`; d.className="mb-1 border-b border-gray-800 pb-1 text-xs md:text-sm " + (type==='good'?'text-green-400':type==='bad'?'text-red-400':'text-green-400'); this.els.log.appendChild(d); this.els.log.scrollTop=this.els.log.scrollHeight; },
    narrate(text) { const d=document.createElement('div'); d.innerHTML=`✨ ${text}`; d.className="narrator-text text-xs"; this.els.log.appendChild(d); this.els.log.scrollTop=this.els.log.scrollHeight; },

    showLore(title, text) {
        sfx.lore(); this.els.loreTitle.innerText = title; this.els.loreText.innerText = text;
        this.els.loreModal.classList.remove('hidden');
    },
    closeLore() { this.els.loreModal.classList.add('hidden'); },
    checkMemories() { [20, 40, 60, 80].forEach(c => { if (this.step >= c && !this.memoriesTriggered.includes(c)) { this.memoriesTriggered.push(c); setTimeout(() => this.showLore("MEMORY RECOVERED", LORE[c]), 800); } }); },

    updateUI() {
        this.els.hpVal.textContent=`${this.hp}/100`; this.els.hpBar.style.width=`${Math.max(0,this.hp)}%`;
        this.els.hpBar.className=`h-full transition-all duration-300 ${this.hp>60?'bg-green-600':this.hp>30?'bg-yellow-500':'bg-red-600'}`;
        this.els.stepVal.textContent=this.step + "";
        ['gaja','magic','chili','potion'].forEach(k=>{
            const btn = document.getElementById(`btnInv${k.charAt(0).toUpperCase()+k.slice(1)}`) as HTMLButtonElement;
            if(btn) btn.disabled=(this.inv[k]<=0);
            document.getElementById(`badge${k.charAt(0).toUpperCase()+k.slice(1)}`).innerText=this.inv[k];
        });
        // Combat Buttons
        ['wire','mojo','roafja'].forEach(k=>{
            const el=document.getElementById(`btnCombat${k.charAt(0).toUpperCase()+k.slice(1)}`) as HTMLButtonElement;
            const cnt=document.getElementById(`cnt${k.charAt(0).toUpperCase()+k.slice(1)}`);
            if(el){
                el.disabled=(this.inv[k]<=0);
                if(k==='wire' && game.bossState.id==='guardian') el.disabled=true;
                cnt.innerText=this.inv[k];
                if(this.inv[k]<=0) el.classList.add('opacity-50'); else el.classList.remove('opacity-50');
            }
            const invVal=document.getElementById(`inv${k.charAt(0).toUpperCase()+k.slice(1)}Val`);
            if(invVal) invVal.innerText=this.inv[k];
        });

        document.querySelectorAll('.step').forEach(el=>el.classList.remove('active'));
        document.querySelectorAll('.player-slot').forEach(el=>el.innerHTML='');
        if(this.step>0 && this.step<=100) {
            const el=document.getElementById(`step-${this.step}`);
            if(el){ el.classList.add('active'); el.querySelector('.player-slot').innerHTML='<div class="player-token">👻</div>'; }
        }
        if(this.bossState.active) {
            this.els.modalPlayerHp.innerText=Math.max(0,this.hp) + ""; this.els.bossPlayerHpBar.style.width=`${Math.max(0,this.hp)}%`;
            this.els.bossPlayerHpBar.className=`h-full transition-all duration-300 w-full ${this.hp>30?'bg-green-500':'bg-red-600'}`;
            this.els.bossStunStatus.style.display = this.bossState.stunned > 0 ? 'inline' : 'none';
            this.els.bossStunStatus.innerText = `⚡ STUN (${this.bossState.stunned})`;
            this.els.bossDodgeStatus.style.display = this.bossState.noDodge > 0 ? 'inline' : 'none';
            this.els.bossDodgeStatus.innerText = `👁️ NO DODGE (${this.bossState.noDodge})`;
        }
        if(this.doubleRollTurns > 0) { this.els.buffIcon.classList.remove('hidden'); this.els.buffIcon.innerText = `2x (${this.doubleRollTurns})`; } else this.els.buffIcon.classList.add('hidden');
        if(this.curseDuration > 0) { this.els.curseIcon.classList.remove('hidden'); this.els.curseIcon.innerText = `🗿 ${this.curseDuration}`; } else this.els.curseIcon.classList.add('hidden');
    },

    showPickup(name, desc, icon) {
        sfx.itemGood();
        this.els.pickupTitle.innerText = name; this.els.pickupIcon.innerText = icon; this.els.pickupDesc.innerText = desc;
        this.els.pickupModal.classList.remove('hidden');
        
        // Determine item type for specific taunt
        let type = 'item'; // Default
        if (name.includes('GAJA')) type = 'pickup_gaja';
        else if (name.includes('MAGIC')) type = 'pickup_magic';
        else if (name.includes('MORICH')) type = 'pickup_chili';
        else if (name.includes('POTION')) type = 'pickup_potion';
        else if (name.includes('TAR')) type = 'pickup_wire';
        else if (name.includes('MOJO')) type = 'pickup_mojo';
        else if (name.includes('ROAFJA')) type = 'pickup_roafja';

        this.taunt(type);
    },
    closePickup() { this.els.pickupModal.classList.add('hidden'); },

    scrollToPlayer() { if(this.step<=0)return; document.getElementById(`step-${this.step}`)?.scrollIntoView({behavior:'smooth',block:'center'}); },
    shakeScreen() { document.body.classList.remove('shake-anim'); void document.body.offsetWidth; document.body.classList.add('shake-anim'); },
    damagePlayer(amt) { 
        this.hp-=amt; 
        sfx.itemBad(); 
        this.shakeScreen(); 
        this.updateUI(); 
        // Don't double taunt in combat loop or if dead (handled by checkGameOver)
        if (!this.bossState.active && this.hp > 0) this.taunt('damage');
    },
    checkGameOver(reason="You fell into the abyss.") {
        if(this.step<0) { 
            sfx.fall(); 
            this.endGame(reason); 
            this.taunt('death_fall');
            return true; 
        }
        if(this.hp<=0) { 
            this.shakeScreen(); 
            this.endGame("You died from damage."); 
            this.taunt('death_damage');
            return true; 
        }
        return false;
    },
    endGame(msg) {
        this.stopBossMusic();
        document.getElementById('deathReason').innerText=msg;
        const overLog=document.getElementById('gameOverLogContent'); const logTitle=document.getElementById('logTitle');
        if(this.bossState.active) { overLog.innerHTML=this.els.bossLog.innerHTML; logTitle.innerText="COMBAT LOG:"; }
        else { overLog.innerHTML=this.els.log.innerHTML; logTitle.innerText="TRAVEL LOG:"; }
        this.els.gameOver.classList.remove('hidden'); this.els.bossModal.classList.add('hidden');
        this.isMoving = false;
    },
    winGame() { 
        this.stopBossMusic();
        sfx.win(); this.step=100; this.updateUI(); this.scrollToPlayer(); this.els.winModal.classList.remove('hidden'); 
        this.taunt('win');
        this.isMoving = false;
    },

    async rollDice() { 
        if(this.bossState.active || this.isMoving) return; 
        this.isMoving = true;
        
        sfx.roll(); 
        if(audioCtx.state === 'suspended') audioCtx.resume();
        let max = 6; if (this.curseDuration > 0) { max = 3; this.curseDuration--; this.log(`Cursed! Max roll 3.`); }
        let d=Math.floor(Math.random()*max)+1; let msg = `Rolled ${d} 🎲`;
        if(this.doubleRollTurns > 0) { d *= 2; this.doubleRollTurns--; msg += ` (x2 = ${d}) 🚀`; }
        this.log(msg, 'good'); 
        
        if (d === 1) this.taunt("roll_low");
        else if (d >= 8) this.taunt("roll_high");

        await new Promise(r=>setTimeout(r,600)); 
        await this.move(d); 
        
        if (!this.bossState.active) {
            this.isMoving = false;
        }
    },
    async move(amt) {
        if(amt>0) sfx.move(); else sfx.itemBad();
        this.step = Math.min(100, this.step + amt); // Cap at 100
        
        if(this.checkGameOver()) return; 
        this.updateUI(); this.scrollToPlayer();
        await this.processTile(); 
        if(this.checkGameOver()) return;
        this.checkMemories(); 
        await this.checkBossTriggers();
    },

    async processTile() {
        await new Promise(r=>setTimeout(r,300)); if(this.step>100 && !this.bossState.active) return; const i=this.step;
        const items = { gaja: [4, 7, 15, 33, 72], magic: [25, 50, 90], chili: [12, 40, 82], potion: [28, 65, 95], wire: [29, 39], mojo: [5,18,35,42,52,68,78,88,92,98], roafja: [14,26,48,62,84] };

        if(items.gaja.includes(i)){ this.inv.gaja++; this.showPickup("GAJA", "Use in inventory. 50% chance +7 Steps, 50% chance -7 Steps.", "🌿"); }
        else if(items.magic.includes(i)){ this.inv.magic++; this.showPickup("MAGIC DICE", "Choose EXACTLY what number to roll (1-6).", "🎲"); }
        else if(items.chili.includes(i)){ this.inv.chili++; this.showPickup("JHAL MORICH", "Rush +15 Steps, but take 20 HP burn damage.", "🌶️"); }
        else if(items.potion.includes(i)){ this.inv.potion++; this.showPickup("POTION", "Randomly Heals, Speeds Up, or Poisons you.", "🧪"); }
        else if(items.wire.includes(i)){ this.inv.wire++; this.showPickup("220V TAR", "Use in Boss Fight. Stuns Boss for 5 turns!", "⚡"); }
        else if(items.mojo.includes(i)){ this.inv.mojo++; this.showPickup("MOJO", "Use in Boss Fight. Instantly restores +20 HP.", "🥤"); }
        else if(items.roafja.includes(i)){ this.inv.roafja++; this.showPickup("ROAFJA", "Use in Boss Fight. Boss CANNOT DODGE for 2 turns.", "🍷"); }
        else if(i===8){ sfx.itemBad(); this.log("Stepped on Shit 💩", 'bad'); this.step-=5; this.taunt("trap_shit"); }
        else if(i===15){ this.log("MUD PIT! Stuck & Damaged! 💩", 'bad'); this.damagePlayer(5); this.step-=2; this.taunt("trap_mud"); }
        else if(i===22){ this.log("Rotten Egg 🥚", 'bad'); this.damagePlayer(10); this.taunt("trap_egg"); }
        else if(i===45){ sfx.itemBad(); this.log("CURSED IDOL! 🗿 -15 HP & Weak Rolls", 'bad'); this.damagePlayer(15); this.curseDuration=10; this.taunt("trap_shit"); }
        else if(i===55){ sfx.fall(); this.log("BLACK HOLE ⚫", 'bad'); this.step=1; this.taunt("fall"); }
        else if(i===75){ sfx.fall(); this.log("SLIPPERY MOSS! 🌿 Falling back 15!", 'bad'); this.step-=15; this.taunt("fall"); }
        else if(i===85){ sfx.fall(); this.log("Banana Slip 🍌", 'bad'); this.step-=10; this.taunt("fall"); }
        this.updateUI(); this.scrollToPlayer();
    },

    async checkBossTriggers() {
        if(this.step>=10 && !this.bossState.triggered.hasina) await this.startBoss('hasina');
        else if(this.step>=20 && !this.bossState.triggered.diddy) await this.startBoss('diddy');
        else if(this.step>=30 && !this.bossState.triggered.bandit) await this.startBoss('bandit');
        else if(this.step>=40 && !this.bossState.triggered.logan) await this.startBoss('logan');
        else if(this.step>=50 && this.banditBribed && !this.bossState.triggered.bandit2) await this.startBoss('bandit2');
        else if(this.step>=60 && !this.bossState.triggered.elon) await this.startBoss('elon');
        else if(this.step>=80 && !this.bossState.triggered.zuck) await this.startBoss('zuck');
        else if(this.step>=90 && !this.bossState.triggered.trump) await this.startBoss('trump');
        else if(this.step>=100 && !this.bossState.triggered.guardian) await this.startBoss('guardian');
    },

    async startBoss(id) {
        this.bossState.active=true; this.bossState.id=id; 
        let realId = id === 'bandit2' ? 'bandit' : id;
        
        // Set Boss HP
        if (id==='diddy') this.bossState.hp = 150;
        else if (realId==='bandit') this.bossState.hp = 80;
        else if (id==='logan') this.bossState.hp = 120;
        else if (id==='elon') this.bossState.hp = 180;
        else if (id==='zuck') this.bossState.hp = 200;
        else if (id==='trump') this.bossState.hp = 220;
        else if (id==='guardian') this.bossState.hp = 250;
        else this.bossState.hp = 100; // Hasina default

        this.bossState.maxHp=this.bossState.hp;
        this.bossState.triggered[id]=true; 
        this.bossState.counterActive=false;
        this.bossState.stunned=0; this.bossState.noDodge=0;
        sfx.itemBad();
        
        this.playBossMusic(realId);
        
        this.els.bossModal.classList.remove('hidden'); this.els.bossPhase1.classList.remove('hidden'); this.els.bossPhase2.classList.add('hidden');
        this.els.bossLoreContainer.classList.add('hidden'); this.els.bossBarsContainer.classList.remove('hidden'); this.els.bossLog.classList.remove('hidden');
        this.els.bossRewardContainer.classList.add('hidden');
        
        this.els.bossTurnIndicator.innerText = "YOUR TURN"; this.els.bossTurnIndicator.className = "text-sm font-bold text-green-400 bg-black/50 py-1 mb-2 rounded";

        const btns = document.querySelectorAll('.combat-btn'); btns.forEach(b => { 
            (b as HTMLButtonElement).disabled = false; 
            (b as HTMLElement).style.opacity = '1'; 
        });

        const btn2 = document.getElementById('btnBossAction2');
        btn2.style.display = 'block';
        
        if(realId==='bandit') {
            document.getElementById('bossName').innerText="THE GREDDY JEW"; document.getElementById('bossIcon').innerText="✡️";
            btn2.innerText = "💸 PAY 10 HP"; btn2.onclick = () => game.payBandit();
        } else if (realId==='guardian') {
            document.getElementById('bossName').innerText="GUARDIAN"; document.getElementById('bossIcon').innerText="👁️";
            btn2.style.display = 'none'; 
        } else if (realId==='logan') {
            document.getElementById('bossName').innerText="LOGAN"; document.getElementById('bossIcon').innerText="🤳";
            btn2.innerText = "🏃 RUN"; btn2.onclick = () => game.bossRun();
        } else if (realId==='elon') {
            document.getElementById('bossName').innerText="ELON"; document.getElementById('bossIcon').innerText="🚀";
            btn2.innerText = "🏃 RUN"; btn2.onclick = () => game.bossRun();
        } else if (realId==='zuck') {
            document.getElementById('bossName').innerText="ZUCK"; document.getElementById('bossIcon').innerText="🦎";
            btn2.innerText = "🏃 RUN"; btn2.onclick = () => game.bossRun();
        } else if (realId==='trump') {
            document.getElementById('bossName').innerText="DONALD"; document.getElementById('bossIcon').innerText="👱";
            btn2.innerText = "🏃 RUN"; btn2.onclick = () => game.bossRun();
        } else {
            document.getElementById('bossName').innerText=id==='hasina'?"SHEIK HASINA":"DIDDY";
            document.getElementById('bossIcon').innerText=id==='hasina'?"👹":"🧢";
            btn2.innerText = "🏃 RUN"; btn2.onclick = () => game.bossRun();
        }
        this.updateBossUI(); this.updateUI(); this.bossLog(`ENCOUNTERED ${realId.toUpperCase()}!`);
        
        // Specific Boss Taunt
        if (realId === 'hasina') this.taunt('boss_hasina');
        else if (realId === 'diddy') this.taunt('boss_diddy');
        else if (realId === 'bandit') this.taunt('boss_bandit');
        else if (realId === 'logan') this.taunt('boss_logan');
        else if (realId === 'elon') this.taunt('boss_elon');
        else if (realId === 'zuck') this.taunt('boss_zuck');
        else if (realId === 'trump') this.taunt('boss_trump');
        else if (realId === 'guardian') this.taunt('boss_guardian');
        else this.taunt('boss_start');
    },

    payBandit() {
        this.damagePlayer(10); this.banditBribed = true; this.bossLog("He smiles greedily. 'See you later...'");
        setTimeout(() => { this.bossState.active=false; this.els.bossModal.classList.add('hidden'); this.log("Bribed Bandit (No Rewards).", 'good'); this.isMoving = false; this.stopBossMusic(); }, 1500);
    },

    bossLog(msg) { this.els.bossLog.innerHTML+=`<br>> ${msg}`; this.els.bossLog.scrollTop=this.els.bossLog.scrollHeight; },
    updateBossUI() { 
        const p=(this.bossState.hp/this.bossState.maxHp)*100; 
        this.els.bossHpBar.style.width=`${Math.max(0,p)}%`; 
        this.els.modalBossHp.innerText=Math.max(0,this.bossState.hp) + "";
        this.els.bossStunStatus.style.display = this.bossState.stunned > 0 ? 'inline' : 'none';
        this.els.bossStunStatus.innerText = `⚡ STUN (${this.bossState.stunned})`;
        this.els.bossDodgeStatus.style.display = this.bossState.noDodge > 0 ? 'inline' : 'none';
        this.els.bossDodgeStatus.innerText = `👁️ NO DODGE (${this.bossState.noDodge})`;
    },
    startCombat() { this.els.bossPhase1.classList.add('hidden'); this.els.bossPhase2.classList.remove('hidden'); this.bossLog("Choose your attack!"); },

    useCombatItem(type) {
        if (this.inv[type] <= 0) return;
        this.inv[type]--;
        if (type === 'wire') {
            this.bossState.stunned += 5;
            this.bossLog("used 220V TAR! Boss STUNNED for 5 turns!");
            sfx.itemBad();
        } else if (type === 'mojo') {
            this.hp = Math.min(100, this.hp + 20);
            this.bossLog("drank MOJO! Restored +20 HP!");
            sfx.itemGood();
            this.taunt('use_mojo');
        } else if (type === 'roafja') {
            this.bossState.noDodge += 2;
            this.bossLog("drank ROAFJA! Boss Sticky (No Dodge) 2 turns!");
            sfx.itemGood();
            this.taunt('use_roafja');
        }
        this.updateUI(); this.updateBossUI();
    },

    async useGaja() { if(this.inv.gaja<=0) return; this.closeInventory(); this.inv.gaja--; this.log("Ate Gaja...", 'good'); this.taunt('use_gaja'); await new Promise(r=>setTimeout(r,500)); Math.random()>0.5 ? await this.move(7) : await this.move(-7); },
    async useMagicDice(n) { if(this.inv.magic<=0) return; this.closeInventory(); this.inv.magic--; this.log(`Magic Dice: ${n}`, 'good'); await this.move(n); },
    async useChili() { if(this.inv.chili<=0) return; this.closeInventory(); this.inv.chili--; this.log("Ate Chili!", 'bad'); this.damagePlayer(20); if(!this.checkGameOver()) await this.move(15); },
    async usePotion() { if(this.inv.potion<=0) return; this.closeInventory(); this.inv.potion--; const r=Math.random(); if(r<0.33){sfx.itemGood();this.hp=100;this.updateUI();} else if(r<0.66) await this.move(10); else await this.move(-10); },

    async playerAttack(type) {
        const btns = document.querySelectorAll('.combat-btn');
        btns.forEach(b => { 
            (b as HTMLButtonElement).disabled = true; 
            (b as HTMLElement).style.opacity = '0.5'; 
        });

        let dmg=0, dodged=false, chance=0;
        if(type==='juta'){sfx.hitLow();dmg=Math.floor(Math.random()*10)+10;chance=0.05;}
        else if(type==='danda'){sfx.hitMed();dmg=Math.floor(Math.random()*15)+25;chance=0.20;}
        else if(type==='lathi'){sfx.hitHigh();dmg=Math.floor(Math.random()*20)+50;chance=0.70;} 
        
        let realId = (this.bossState.id === 'bandit2') ? 'bandit' : this.bossState.id;

        if(this.bossState.noDodge > 0) { chance = 0; this.bossState.noDodge--; }
        if(Math.random()<chance) dodged=true;

        try {
            if(dodged) { 
                sfx.dodge(); this.bossLog(`BOSS DODGED the ${type.toUpperCase()}! 💨`); this.bossState.counterActive=true; 
                this.taunt('player_miss');
            }
            else { 
                this.bossState.hp-=dmg; this.updateBossUI(); this.bossLog(`Hit with ${type}! -${dmg} HP`); 
                
                if (realId === 'trump') this.taunt('boss_trump_hit');
                else this.taunt('boss_hit_boss');
            }
            if(this.bossState.hp<=0) { await this.bossDefeated(); return; }
            
            await new Promise(r=>setTimeout(r,1000));
            
            // BOSS TURN
            if(this.bossState.stunned > 0) {
                this.bossState.stunned--;
                this.bossLog("Boss is STUNNED! Skips turn.");
            } else {
                this.els.bossTurnIndicator.innerText = "BOSS ATTACKING..."; this.els.bossTurnIndicator.className = "text-sm font-bold text-red-400 bg-black/50 py-1 mb-2 rounded animate-pulse";
                await new Promise(r=>setTimeout(r,1000));

                let bossDmg=0, atkName="Attack";
                
                // BOSS ATTACK LOGIC
                if(realId==='diddy') { bossDmg=8; atkName="Baby Oil Slip"; }
                else if(realId==='bandit') { bossDmg = Math.floor(Math.random()*10)+1; atkName = (bossDmg<=5) ? "Quick Pickpocket" : "Mugged!"; }
                else if(realId==='logan') { const a=[{n:"Crypto Rug Pull",d:15},{n:"Energy Drink Spit",d:10},{n:"Fake Apology",d:5}]; const r=a[Math.floor(Math.random()*a.length)]; bossDmg=r.d; atkName=r.n; }
                else if(realId==='elon') { const a=[{n:"Fired via Email",d:20},{n:"Exploding Rocket",d:25},{n:"Cringe Tweet",d:10}]; const r=a[Math.floor(Math.random()*a.length)]; bossDmg=r.d; atkName=r.n; }
                else if(realId==='zuck') { const a=[{n:"Privacy Violation",d:15},{n:"Data Harvest",d:20},{n:"Metaverse Kick",d:18}]; const r=a[Math.floor(Math.random()*a.length)]; bossDmg=r.d; atkName=r.n; }
                else if(realId==='trump') { 
                    const a=[{n:"Hide Epstein Files",d:10},{n:"5 Trillion to Isntreal",d:29},{n:"Stinky Ass",d:31},{n:"Captured by ICE Agents",d:25}]; 
                    const r=a[Math.floor(Math.random()*a.length)]; 
                    bossDmg=r.d; atkName=r.n; 
                }
                else if(realId==='guardian') { bossDmg = 25; atkName = "Divine Smite"; }
                else { const a=[{n:"Helmet Throw",d:8},{n:"Crocodile Tears",d:5},{n:"Internet Shutdown",d:10},{n:"Ayna Ghor Threat",d:12}]; const r=a[Math.floor(Math.random()*a.length)]; bossDmg=r.d; atkName=r.n; }
                
                if(this.bossState.counterActive) { sfx.crit(); bossDmg*=2; this.bossLog("CRITICAL COUNTER! 💥"); this.bossState.counterActive=false; }
                else { sfx.damageTaken(); }
                
                this.bossLog(`${atkName}! -${bossDmg} HP`); 
                this.damagePlayer(bossDmg);
                
                // Narrate boss attack specifically
                this.taunt(null, `${atkName}! taking ${bossDmg} health.`);

                this.els.bossTurnIndicator.innerText = "YOUR TURN"; this.els.bossTurnIndicator.className = "text-sm font-bold text-green-400 bg-black/50 py-1 mb-2 rounded";
                
                if(this.hp<=0) { 
                    if(realId==='guardian'){
                        this.bossLog("GUARDIAN: 'YOU ARE NOT READY.'"); await new Promise(r=>setTimeout(r,1500));
                        this.hp=50; this.step=50; this.bossState.active=false; this.els.bossModal.classList.add('hidden'); this.log("Thrown to Step 50!", 'bad'); this.updateUI(); this.scrollToPlayer();
                        this.taunt("fall");
                        this.isMoving = false;
                        this.bossState.triggered.guardian = false; // Reset trigger so boss can be fought again
                        this.stopBossMusic();
                    } else if(realId==='trump') {
                        this.bossLog("DONALD: 'YOU'RE DEPORTED!'"); await new Promise(r=>setTimeout(r,1500));
                        this.hp=50; this.step=50; this.bossState.active=false; this.els.bossModal.classList.add('hidden'); 
                        this.log("Deported to Step 50!", 'bad'); this.updateUI(); this.scrollToPlayer();
                        this.taunt("fall");
                        this.isMoving = false;
                        this.stopBossMusic();
                    } else { 
                        this.taunt('death_boss');
                        this.endGame("Killed by Boss."); 
                    }
                    return; 
                }
            }
        } finally { 
            if(this.hp>0 && this.bossState.hp>0){ 
                btns.forEach(b => { 
                    (b as HTMLButtonElement).disabled = false; 
                    (b as HTMLElement).style.opacity = '1'; 
                }); 
            } 
        }
    },

    async bossDefeated() {
        this.stopBossMusic();
        sfx.itemGood();
        this.els.bossBarsContainer.classList.add('hidden'); this.els.bossLog.classList.add('hidden'); this.els.bossPhase2.classList.add('hidden'); this.els.bossTurnIndicator.classList.add('hidden');
        if (this.bossState.id === 'guardian') { this.winGame(); } else { this.els.bossRewardContainer.classList.remove('hidden'); }
    },
    
    claimReward(type) {
        if(type==='heal') { this.hp = Math.min(100, this.hp+50); this.log("Healed +50 HP!", 'good'); }
        if(type==='buff') { this.doubleRollTurns = 5; this.log("Double Roll Active (5 Turns)!", 'good'); }
        if(type==='jump') { this.step = Math.min(100, this.step + 15); this.log("Jumped +15 Steps!", 'good'); this.updateUI(); this.scrollToPlayer(); }
        this.showBossLore();
    },

    showBossLore() {
        this.els.bossRewardContainer.classList.add('hidden'); this.els.bossLoreContainer.classList.remove('hidden');
        let realId = (this.bossState.id === 'bandit2') ? 'bandit' : this.bossState.id;
        this.els.bossLoreText.innerText = LORE[realId];
    },
    closeBoss() { 
        this.els.bossModal.classList.add('hidden'); 
        this.bossState.active=false; 
        this.log(`Defeated Boss!`, 'good'); 
        this.isMoving = false;
    },
    async bossRun() { 
        this.stopBossMusic();
        sfx.fall(); 
        this.bossLog("Trying to run..."); 
        await new Promise(r=>setTimeout(r,1000)); 
        this.bossLog("CAUGHT! Sent to Step 0."); 
        this.step=0; 
        setTimeout(()=>{
            this.els.bossModal.classList.add('hidden');
            this.bossState.active=false;
            this.updateUI();
            this.scrollToPlayer();
            this.isMoving = false;
        },1500); 
        this.taunt("fall"); 
    },
    
    openInventory() { if(!this.bossState.active) this.els.invModal.classList.remove('hidden'); },
    closeInventory() { this.els.invModal.classList.add('hidden'); document.getElementById('magicPicker').classList.add('hidden'); },
    openMagicPicker() { if(this.inv.magic>0) document.getElementById('magicPicker').classList.remove('hidden'); },
    toggleInfo() { this.els.infoModal.classList.toggle('hidden'); },
    
    // DEV TOOLS
    openTestMenu() { 
        this.els.passwordModal.classList.remove('hidden');
        this.els.devPasswordInput.value = "";
        this.els.devPasswordInput.focus();
    },
    closePasswordModal() {
        this.els.passwordModal.classList.add('hidden');
    },
    checkPassword() {
        const pass = this.els.devPasswordInput.value;
        if(pass === "1234") {
            this.closePasswordModal();
            this.els.testModal.classList.remove('hidden'); 
        } else {
            alert("Access Denied.");
            this.els.devPasswordInput.value = "";
        }
    },
    closeTestMenu() { this.els.testModal.classList.add('hidden'); },
    cheatJump() {
        const val = parseInt((document.getElementById('cheatStepInput') as HTMLInputElement).value);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            this.step = val;
            this.updateUI();
            this.scrollToPlayer();
            this.log(`[DEV] Jumped to step ${val}`, 'good');
            this.closeTestMenu();
            this.processTile();
            this.checkBossTriggers();
        }
    },
    cheatItem(item) {
        this.inv[item]++;
        this.log(`[DEV] Added ${item}`, 'good');
        this.updateUI();
    },
    cheatHeal() {
        this.hp = 100;
        this.updateUI();
        this.log(`[DEV] Healed to 100`, 'good');
    }
};

(window as any).game = game;
document.addEventListener('keydown', (e) => { 
    if(game.bossState.active)return; 
    if(e.key.toLowerCase()==='r')game.rollDice(); 
    if(e.key.toLowerCase()==='i')game.openInventory();
    // Handle enter key on password modal
    if(e.key === 'Enter' && !game.els.passwordModal.classList.contains('hidden')) {
        game.checkPassword();
    }
});
game.init();