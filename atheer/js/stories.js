/* =====================================================================
   قصص تفاعلية — ست قصص قصيرة مرسومة ومتحركة، تُقرأ جملةً جملة
   مع تظليل الكلمات، وفيها اختيارات تقود إلى نهايات لطيفة مختلفة
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'stories';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const EN_FONT = 'system-ui,"Segoe UI",Roboto,sans-serif';
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* =====================================================================
     القصص. كل صفحة: sc = المشهد، a = معطيات المشهد، ar/en = الجمل
     (الجملة قد تكون [مؤنث، مذكر] في قصة المحفظة)، next أو ch (اختيارات) أو end
     ===================================================================== */
  const STORIES = [
    { id: 'kitten', ic: '🐱', ar: 'مِشْمِشُ فِي السُّوقِ', en: 'Mishmish in the Souq', col: ['#FFB25C', '#E5762B'], start: 'p1', pages: {
      p1: { sc: 'souq', a: { kit: [150, 'walk'], mom: [230, 'walk'] }, next: 'p2',
        ar: ['كَانَتْ مِشْمِشُ قِطَّةً صَغِيرَةً تُحِبُّ اللَّعِبَ.', 'ذَهَبَتْ مَعَ أُمِّهَا إِلَى السُّوقِ الكَبِيرِ.'],
        en: ['Mishmish was a little kitten who loved to play.', 'She went with her mother to the big souq.'] },
      p2: { sc: 'souq', a: { kit: [170, 'jump'], bfly: 1 }, next: 'p3',
        ar: ['رَأَتْ مِشْمِشُ فَرَاشَةً مُلَوَّنَةً، فَرَكَضَتْ خَلْفَهَا.', 'طَارَتِ الفَرَاشَةُ بَعِيدًا، وَالْتَفَتَتْ مِشْمِشُ، فَلَمْ تَجِدْ أُمَّهَا!'],
        en: ['Mishmish saw a colorful butterfly and ran after it.', 'The butterfly flew away. Mishmish looked around, and her mother was gone!'] },
      p3: { sc: 'souq', a: { kit: [200, 'sad'] },
        ar: ['جَلَسَتْ مِشْمِشُ حَزِينَةً بَيْنَ الدَّكَاكِينِ.', 'مَاذَا تَفْعَلُ مِشْمِشُ؟'],
        en: ['Mishmish sat down sadly between the shops.', 'What should Mishmish do?'],
        ch: [{ ic: '🐦', ar: 'تَسْأَلُ العُصْفُورَ', en: 'Ask the little bird', to: 'p4a' }, { ic: '📍', ar: 'تَبْقَى مَكَانَهَا وَتَمُوءُ', en: 'Stay in place and meow', to: 'p4b' }] },
      p4a: { sc: 'souq', a: { kit: [150, 'up'], bird: 'fly' }, next: 'e1',
        ar: ['طَارَ العُصْفُورُ عَالِيًا فَوْقَ السُّوقِ.', 'ثُمَّ قَالَ: أَرَى قِطَّةً كَبِيرَةً عِنْدَ دُكَّانِ التَّمْرِ!'],
        en: ['The bird flew high above the souq.', 'Then he said: I see a big cat at the date shop!'] },
      e1: { sc: 'souq', a: { kit: [200, 'happy'], mom: [245, 'hug'], bird: 'sit', hearts: 1, dates: 1 }, end: 'help',
        ar: ['رَكَضَتْ مِشْمِشُ إِلَى أُمِّهَا وَعَانَقَتْهَا.', 'وَقَالَتْ لِلْعُصْفُورِ: شُكْرًا يَا صَدِيقِي!'],
        en: ['Mishmish ran to her mother and hugged her.', 'She told the bird: Thank you, my friend!'],
        mar: 'طَلَبُ المُسَاعَدَةِ شَجَاعَةٌ، وَالشُّكْرُ جَمِيلٌ.', men: 'Asking for help is brave, and saying thank you is beautiful.' },
      p4b: { sc: 'souq', a: { kit: [200, 'meow'] }, next: 'e2',
        ar: ['بَقِيَتْ مِشْمِشُ فِي مَكَانِهَا، وَقَالَتْ: مِيَاو! مِيَاو!', 'فَسَمِعَتْ أُمُّهَا صَوْتَهَا مِنْ بَعِيدٍ.'],
        en: ['Mishmish stayed where she was and said: Meow! Meow!', 'Her mother heard her voice from far away.'] },
      e2: { sc: 'souq', a: { kit: [180, 'happy'], mom: [228, 'hug'], hearts: 1 }, end: 'stay',
        ar: ['جَاءَتِ الأُمُّ مُسْرِعَةً، وَضَمَّتْ مِشْمِشَ بِحَنَانٍ.', 'وَوَعَدَتْ مِشْمِشُ أَنْ تَبْقَى قَرِيبَةً مِنْ أُمِّهَا.'],
        en: ['Her mother hurried over and hugged Mishmish gently.', 'Mishmish promised to stay close to her mother.'],
        mar: 'إِذَا ضِعْنَا، نَبْقَى فِي مَكَانِنَا حَتَّى يَجِدَنَا أَهْلُنَا.', men: 'If we get lost, we stay in place until our family finds us.' }
    } },
    { id: 'penguin', ic: '🐧', ar: 'بُوبُو البِطْرِيقُ الكَرِيمُ', en: 'Bobo the Kind Penguin', col: ['#7CC8F8', '#2E86D6'], start: 'p1', pages: {
      p1: { sc: 'ice', a: { bobo: [190, 'wave'] }, next: 'p2',
        ar: ['فِي بِلَادِ الثَّلْجِ، عَاشَ بِطْرِيقٌ صَغِيرٌ اسْمُهُ بُوبُو.', 'كَانَ بُوبُو يُحِبُّ السِّبَاحَةَ وَصَيْدَ السَّمَكِ.'],
        en: ['In the land of snow lived a little penguin called Bobo.', 'Bobo loved swimming and catching fish.'] },
      p2: { sc: 'ice', a: { bobo: [250, 'dive'], fish: 3 }, next: 'p3',
        ar: ['فِي يَوْمٍ بَارِدٍ، غَاصَ بُوبُو فِي المَاءِ.', 'وَخَرَجَ وَمَعَهُ ثَلَاثُ سَمَكَاتٍ لَامِعَةٍ!'],
        en: ['One cold day, Bobo dived into the water.', 'He came out with three shiny fish!'] },
      p3: { sc: 'ice', a: { bobo: [130, 'hold'], fish: 3, lulu: [260, 'sad'] },
        ar: ['رَأَى بُوبُو صَدِيقَتَهُ لُولُو جَالِسَةً وَحْدَهَا.', 'كَانَتْ جَائِعَةً، وَلَمْ تَصْطَدْ شَيْئًا.', 'مَاذَا يَفْعَلُ بُوبُو؟'],
        en: ['Bobo saw his friend Lulu sitting all alone.', 'She was hungry and had not caught anything.', 'What should Bobo do?'],
        ch: [{ ic: '🐟', ar: 'يُعْطِيهَا سَمَكَةً', en: 'Give her a fish', to: 'p4a' }, { ic: '🎣', ar: 'يُعَلِّمُهَا الصَّيْدَ', en: 'Teach her to fish', to: 'p4b' }] },
      p4a: { sc: 'ice', a: { bobo: [160, 'give'], lulu: [235, 'happy'], fish: 1, give: 1 },
        ar: ['أَعْطَى بُوبُو لُولُو سَمَكَةً كَبِيرَةً.', 'ابْتَسَمَتْ لُولُو وَقَالَتْ: شُكْرًا يَا بُوبُو!', 'مَاذَا يَفْعَلَانِ بَعْدَ ذَلِكَ؟'],
        en: ['Bobo gave Lulu a big fish.', 'Lulu smiled and said: Thank you, Bobo!', 'What should they do next?'],
        ch: [{ ic: '🐧', ar: 'يَدْعُوَانِ الأَصْدِقَاءَ', en: 'Invite their friends', to: 'e1' }, { ic: '⛄', ar: 'يَبْنِيَانِ رَجُلَ ثَلْجٍ', en: 'Build a snowman', to: 'e3' }] },
      e1: { sc: 'ice', a: { bobo: [150, 'happy'], lulu: [215, 'happy'], friends: 1, hearts: 1 }, end: 'share',
        ar: ['جَاءَ الأَصْدِقَاءُ، وَتَقَاسَمُوا الطَّعَامَ مَعًا.', 'صَارَ السَّمَكُ قَلِيلًا، لَكِنَّ الفَرَحَ صَارَ كَبِيرًا!'],
        en: ['Their friends came, and they all shared the food.', 'The fish was little, but the joy was big!'],
        mar: 'حِينَ نَتَقَاسَمُ، يَكْبُرُ الفَرَحُ.', men: 'When we share, happiness grows.' },
      e3: { sc: 'ice', a: { bobo: [120, 'happy'], lulu: [290, 'happy'], snowman: 1, hearts: 1 }, end: 'play',
        ar: ['بَنَى بُوبُو وَلُولُو رَجُلَ ثَلْجٍ ضَاحِكًا.', 'وَأَلْبَسَاهُ وِشَاحًا أَحْمَرَ، وَضَحِكَا كَثِيرًا!'],
        en: ['Bobo and Lulu built a smiling snowman.', 'They gave him a red scarf and laughed a lot!'],
        mar: 'الصَّدَاقَةُ تَجْعَلُ اللَّعِبَ أَجْمَلَ.', men: 'Friendship makes playing more fun.' },
      p4b: { sc: 'water', a: {}, next: 'e2',
        ar: ['قَالَ بُوبُو: تَعَالَيْ، سَأُعَلِّمُكِ الصَّيْدَ!', 'فَغَاصَا مَعًا فِي المَاءِ الأَزْرَقِ.'],
        en: ['Bobo said: Come, I will teach you to fish!', 'So they dived together into the blue water.'] },
      e2: { sc: 'ice', a: { bobo: [150, 'happy'], lulu: [240, 'hold'], fish: 1, sun: 1, hearts: 1 }, end: 'teach',
        ar: ['اصْطَادَتْ لُولُو سَمَكَتَهَا الأُولَى، وَفَرِحَتْ كَثِيرًا.', 'ثُمَّ أَكَلَا مَعًا تَحْتَ الشَّمْسِ.'],
        en: ['Lulu caught her very first fish and was so happy.', 'Then they ate together under the sun.'],
        mar: 'أَنْ نُعَلِّمَ صَدِيقَنَا، هَدِيَّةٌ جَمِيلَةٌ.', men: 'Teaching a friend is a beautiful gift.' }
    } },
    { id: 'camel', ic: '🐪', ar: 'جَمَّولُ وَالنَّخْلَةُ', en: 'Jammoul and the Palm Tree', col: ['#F7C66B', '#D0892A'], start: 'p1', pages: {
      p1: { sc: 'nile', a: { camel: [120, 'walk'], palm: 0 }, next: 'p2',
        ar: ['عَلَى ضِفَّةِ النِّيلِ، كَانَتْ نَخْلَةٌ طَوِيلَةٌ.', 'وَكَانَ الجَمَلُ جَمَّولُ يَمُرُّ بِهَا كُلَّ يَوْمٍ.'],
        en: ['On the bank of the Nile stood a tall palm tree.', 'Jammoul the camel walked past it every day.'] },
      p2: { sc: 'nile', a: { camel: [150, 'look'], palm: 1, hot: 1 }, next: 'p3',
        ar: ['فِي يَوْمٍ حَارٍّ، رَأَى جَمَّولُ النَّخْلَةَ حَزِينَةً.', 'قَالَتِ النَّخْلَةُ: أَنَا عَطْشَى، وَالمَاءُ بَعِيدٌ عَنِّي.'],
        en: ['On a hot day, Jammoul saw that the palm tree was sad.', 'The palm said: I am thirsty, and the water is far away.'] },
      p3: { sc: 'nile', a: { camel: [150, 'think'], palm: 1, hot: 1 },
        ar: ['فَكَّرَ جَمَّولُ: كَيْفَ أُسَاعِدُهَا؟', 'مَاذَا يَفْعَلُ جَمَّولُ؟'],
        en: ['Jammoul thought: How can I help her?', 'What should Jammoul do?'],
        ch: [{ ic: '🪣', ar: 'يَحْمِلُ المَاءَ مِنَ النِّيلِ', en: 'Carry water from the Nile', to: 'p4a' }, { ic: '⛏️', ar: 'يَحْفِرُ قَنَاةً صَغِيرَةً', en: 'Dig a little channel', to: 'p4b' }] },
      p4a: { sc: 'nile', a: { camel: [160, 'buckets'], palm: .5 }, next: 'e1',
        ar: ['مَلَأَ جَمَّولُ دَلْوَيْنِ مِنْ مَاءِ النِّيلِ.', 'وَسَقَى النَّخْلَةَ يَوْمًا بَعْدَ يَوْمٍ.'],
        en: ['Jammoul filled two buckets with Nile water.', 'He watered the palm tree day after day.'] },
      e1: { sc: 'nile', a: { camel: [165, 'happy'], palm: 0, dates: 1, hearts: 1 }, end: 'kind',
        ar: ['اخْضَرَّتِ النَّخْلَةُ، وَأَعْطَتْ تَمْرًا حُلْوًا.', 'وَقَالَتْ: هَذَا لَكَ يَا جَمَّولُ، شُكْرًا لَكَ!'],
        en: ['The palm turned green and gave sweet dates.', 'She said: These are for you, Jammoul. Thank you!'],
        mar: 'مَنْ يَزْرَعِ الخَيْرَ، يَحْصُدِ الخَيْرَ.', men: 'Whoever plants kindness, harvests kindness.' },
      p4b: { sc: 'nile', a: { camel: [190, 'dig'], palm: .6, canal: .6 }, next: 'e2',
        ar: ['حَفَرَ جَمَّولُ بِخُفِّهِ قَنَاةً صَغِيرَةً.', 'فَجَرَى مَاءُ النِّيلِ حَتَّى وَصَلَ إِلَى النَّخْلَةِ.'],
        en: ['Jammoul dug a little channel with his hoof.', 'The Nile water flowed all the way to the palm tree.'] },
      e2: { sc: 'nile', a: { camel: [170, 'happy'], palm: 0, canal: 1, flowers: 1, hearts: 1 }, end: 'idea',
        ar: ['شَرِبَتِ النَّخْلَةُ، وَشَرِبَتْ مَعَهَا زُهُورٌ كَثِيرَةٌ.', 'فَصَارَ المَكَانُ حَدِيقَةً خَضْرَاءَ جَمِيلَةً!'],
        en: ['The palm drank, and many flowers drank too.', 'The place became a beautiful green garden!'],
        mar: 'الفِكْرَةُ الذَّكِيَّةُ تَنْفَعُ الكَثِيرِينَ.', men: 'A clever idea can help many.' }
    } },
    { id: 'cloud', ic: '☁️', ar: 'الغَيْمَةُ الصَّغِيرَةُ رَذَاذُ', en: 'Rathath the Little Cloud', col: ['#A9C8FF', '#5B86E5'], start: 'p1', pages: {
      p1: { sc: 'sky', a: { cl: [200, 90, .8, 'happy'], big: 1 }, next: 'p2',
        ar: ['فِي السَّمَاءِ الزَّرْقَاءِ، عَاشَتْ غَيْمَةٌ صَغِيرَةٌ اسْمُهَا رَذَاذُ.', 'كَانَتْ تَتَمَنَّى أَنْ تُمْطِرَ مِثْلَ الغُيُومِ الكَبِيرَةِ.'],
        en: ['In the blue sky lived a little cloud called Rathath.', 'She wished she could rain like the big clouds.'] },
      p2: { sc: 'sky', a: { cl: [200, 90, .8, 'try'], drops: 2 }, next: 'p3',
        ar: ['حَاوَلَتْ رَذَاذُ أَنْ تُمْطِرَ، فَنَزَلَتْ قَطْرَتَانِ فَقَطْ!', 'فَقَالَتْ بِحُزْنٍ: أَنَا صَغِيرَةٌ جِدًّا.'],
        en: ['Rathath tried to rain, but only two drops fell!', 'She said sadly: I am too small.'] },
      p3: { sc: 'sky', a: { cl: [230, 90, .8, 'sad'], wind: 1 },
        ar: ['جَاءَتِ الرِّيحُ وَقَالَتْ: لَا تَحْزَنِي يَا رَذَاذُ.', 'مَاذَا تَفْعَلُ رَذَاذُ؟'],
        en: ['The wind came and said: Do not be sad, Rathath.', 'What should Rathath do?'],
        ch: [{ ic: '☁️', ar: 'تَجْمَعُ صَدِيقَاتِهَا الغُيُومَ', en: 'Gather her cloud friends', to: 'p4a' }, { ic: '🌊', ar: 'تَصْبِرُ وَتَكْبَرُ فَوْقَ البَحْرِ', en: 'Be patient and grow over the sea', to: 'p4b' }] },
      p4a: { sc: 'sky', a: { cl: [200, 85, 1.5, 'happy'], gather: 1 }, next: 'e1',
        ar: ['نَادَتْ رَذَاذُ الغُيُومَ الصَّغِيرَةَ، فَاجْتَمَعْنَ مَعًا.', 'وَصِرْنَ غَيْمَةً كَبِيرَةً رَمَادِيَّةً!'],
        en: ['Rathath called the little clouds, and they gathered together.', 'They became one big grey cloud!'] },
      e1: { sc: 'sky', a: { cl: [200, 75, 1.5, 'happy'], rain: 1, rainbow: 1, field: 1 }, end: 'together',
        ar: ['هَطَلَ مَطَرٌ لَطِيفٌ عَلَى الحُقُولِ العَطْشَى.', 'وَظَهَرَ قَوْسُ قُزَحٍ يَبْتَسِمُ لِلْجَمِيعِ.'],
        en: ['Gentle rain fell on the thirsty fields.', 'And a rainbow appeared, smiling at everyone.'],
        mar: 'مَعًا نَسْتَطِيعُ أَنْ نَصْنَعَ أَشْيَاءَ كَبِيرَةً.', men: 'Together we can do big things.' },
      p4b: { sc: 'sky', a: { cl: [200, 90, 1.1, 'happy'], sea: 1, grow: 1 },
        ar: ['طَارَتْ رَذَاذُ فَوْقَ البَحْرِ، وَصَبَرَتْ يَوْمًا بَعْدَ يَوْمٍ.', 'وَكَانَتْ تَكْبَرُ قَلِيلًا كُلَّ صَبَاحٍ.', 'عَلَى مَنْ تُمْطِرُ رَذَاذُ؟'],
        en: ['Rathath floated over the sea and waited patiently, day after day.', 'Every morning she grew a little bigger.', 'Where should Rathath rain?'],
        ch: [{ ic: '🌳', ar: 'عَلَى شَجَرَةٍ عَطْشَى', en: 'On a thirsty tree', to: 'e2' }, { ic: '🌵', ar: 'عَلَى الصَّحْرَاءِ الوَاسِعَةِ', en: 'On the wide desert', to: 'e4' }] },
      e2: { sc: 'sky', a: { cl: [210, 80, 1.3, 'happy'], rain: 1, tree: 1 }, end: 'patience',
        ar: ['أَمْطَرَتْ رَذَاذُ عَلَى شَجَرَةٍ عَطْشَى.', 'فَتَفَتَّحَتْ أَزْهَارُ الشَّجَرَةِ فَرَحًا!'],
        en: ['Rathath rained on a thirsty tree.', 'And the tree burst into happy blossoms!'],
        mar: 'بِالصَّبْرِ نَكْبَرُ، وَتَتَحَقَّقُ أَحْلَامُنَا.', men: 'With patience we grow, and our dreams come true.' },
      e4: { sc: 'sky', a: { cl: [200, 80, 1.3, 'happy'], rain: 1, desert: 1 }, end: 'small',
        ar: ['أَمْطَرَتْ رَذَاذُ عَلَى الصَّحْرَاءِ الوَاسِعَةِ.', 'فَتَفَتَّحَتْ زَهْرَةٌ صَغِيرَةٌ وَقَالَتْ: شُكْرًا يَا رَذَاذُ!'],
        en: ['Rathath rained on the wide desert.', 'A tiny flower opened and said: Thank you, Rathath!'],
        mar: 'كُلُّ عَطَاءٍ، وَلَوْ كَانَ صَغِيرًا، يَصْنَعُ فَرْقًا.', men: 'Every gift, even a small one, makes a difference.' }
    } },
    { id: 'star', ic: '⭐', ar: 'لَمْعَةُ النَّجْمَةُ الشُّجَاعَةُ', en: 'Lamaa the Brave Star', col: ['#8E8CF2', '#4B48B8'], start: 'p1', pages: {
      p1: { sc: 'night', a: { star: [200, 80, .3, 'shy'], stars: 1 }, next: 'p2',
        ar: ['فِي السَّمَاءِ، كَانَتْ نَجْمَةٌ صَغِيرَةٌ اسْمُهَا لَمْعَةُ.', 'كَانَتْ خَجُولَةً، وَنُورُهَا ضَعِيفٌ.'],
        en: ['In the sky there was a little star called Lamaa.', 'She was shy, and her light was weak.'] },
      p2: { sc: 'night', a: { star: [300, 70, .3, 'worry'], clouds: 1, boat: [140, 'lost'] }, next: 'p3',
        ar: ['فِي لَيْلَةٍ مُظْلِمَةٍ، ضَاعَ قَارِبٌ صَغِيرٌ فِي البَحْرِ.', 'كَانَتِ الغُيُومُ تُغَطِّي القَمَرَ وَالنُّجُومَ الكَبِيرَةَ.'],
        en: ['One dark night, a little boat got lost at sea.', 'Clouds covered the moon and the big stars.'] },
      p3: { sc: 'night', a: { star: [260, 95, .35, 'think'], clouds: 1, boat: [150, 'lost'] },
        ar: ['قَالَتْ لَمْعَةُ: هَلْ أَسْتَطِيعُ أَنْ أُسَاعِدَ؟', 'مَاذَا تَفْعَلُ لَمْعَةُ؟'],
        en: ['Lamaa said: Can I help?', 'What should Lamaa do?'],
        ch: [{ ic: '✨', ar: 'تَلْمَعُ بِكُلِّ قُوَّتِهَا', en: 'Shine with all her might', to: 'p4a' }, { ic: '🌬️', ar: 'تَطْلُبُ العَوْنَ مِنَ الرِّيحِ', en: 'Ask the wind for help', to: 'p4b' }] },
      p4a: { sc: 'night', a: { star: [250, 85, 1.2, 'brave'], clouds: 1, boat: [170, 'see'] }, next: 'e1',
        ar: ['أَغْمَضَتْ لَمْعَةُ عَيْنَيْهَا، وَلَمَعَتْ أَقْوَى فَأَقْوَى!', 'فَرَأَى البَحَّارُ نُورَهَا، وَعَرَفَ الطَّرِيقَ.'],
        en: ['Lamaa closed her eyes and shone brighter and brighter!', 'The sailor saw her light and found the way.'] },
      e1: { sc: 'night', a: { star: [200, 70, 1, 'happy'], clouds: 1, boat: [250, 'home'], shore: 1, hearts: 1 }, end: 'light',
        ar: ['وَصَلَ القَارِبُ إِلَى الشَّاطِئِ سَالِمًا.', 'وَصَارَتْ لَمْعَةُ أَشْجَعَ نَجْمَةٍ فِي السَّمَاءِ!'],
        en: ['The boat reached the shore safely.', 'And Lamaa became the bravest star in the sky!'],
        mar: 'نُورٌ صَغِيرٌ يَسْتَطِيعُ أَنْ يُضِيءَ طَرِيقًا كَبِيرًا.', men: 'A small light can light up a long way.' },
      p4b: { sc: 'night', a: { star: [140, 80, .5, 'happy'], clouds: .5, wind: 1, boat: [230, 'lost'] }, next: 'e2',
        ar: ['طَارَتْ لَمْعَةُ إِلَى الرِّيحِ وَقَالَتْ: سَاعِدِينَا مِنْ فَضْلِكِ!', 'فَنَفَخَتِ الرِّيحُ، وَابْتَعَدَتِ الغُيُومُ.'],
        en: ['Lamaa flew to the wind and said: Please help us!', 'The wind blew, and the clouds drifted away.'] },
      e2: { sc: 'night', a: { star: [150, 80, .8, 'happy'], moon: 1, stars: 1, boat: [250, 'home'], shore: 1, hearts: 1 }, end: 'ask',
        ar: ['أَضَاءَ القَمَرُ وَالنُّجُومُ البَحْرَ كُلَّهُ.', 'وَعَادَ القَارِبُ إِلَى بَيْتِهِ، وَالجَمِيعُ يَبْتَسِمُ.'],
        en: ['The moon and the stars lit up the whole sea.', 'The boat went home, and everyone smiled.'],
        mar: 'مِنَ الشَّجَاعَةِ أَنْ نَطْلُبَ العَوْنَ لِنُسَاعِدَ غَيْرَنَا.', men: 'It is brave to ask for help so we can help others.' }
    } },
    { id: 'wallet', ic: '👛', ar: ['سَلْمَى وَالمَحْفَظَةُ الحَمْرَاءُ', 'سَامِي وَالمَحْفَظَةُ الحَمْرَاءُ'], en: ['Salma and the Red Wallet', 'Sami and the Red Wallet'], col: ['#FF9C9C', '#E0565B'], start: 'p1', pages: {
      p1: { sc: 'park', a: { kid: [160, 'play'], ball: 'bounce' }, next: 'p2',
        ar: [['خَرَجَتْ سَلْمَى إِلَى الحَدِيقَةِ لِتَلْعَبَ بِالكُرَةِ.', 'خَرَجَ سَامِي إِلَى الحَدِيقَةِ لِيَلْعَبَ بِالكُرَةِ.'], 'كَانَتِ الشَّمْسُ دَافِئَةً، وَالعَصَافِيرُ تُغَرِّدُ.'],
        en: [['Salma went to the park to play with her ball.', 'Sami went to the park to play with his ball.'], 'The sun was warm, and the birds were singing.'] },
      p2: { sc: 'park', a: { kid: [130, 'point'], ball: 'bench', wallet: 'ground' }, next: 'p3',
        ar: ['تَدَحْرَجَتِ الكُرَةُ تَحْتَ مَقْعَدٍ خَشَبِيٍّ.', ['وَهُنَاكَ وَجَدَتْ سَلْمَى مَحْفَظَةً حَمْرَاءَ!', 'وَهُنَاكَ وَجَدَ سَامِي مَحْفَظَةً حَمْرَاءَ!']],
        en: ['The ball rolled under a wooden bench.', ['And there, Salma found a red wallet!', 'And there, Sami found a red wallet!']] },
      p3: { sc: 'park', a: { kid: [200, 'hold'], wallet: 'open' },
        ar: [['فَتَحَتْهَا، فَرَأَتْ فِيهَا نُقُودًا وَصُورَةَ عَائِلَةٍ.', 'فَتَحَهَا، فَرَأَى فِيهَا نُقُودًا وَصُورَةَ عَائِلَةٍ.'], ['مَاذَا تَفْعَلُ سَلْمَى؟', 'مَاذَا يَفْعَلُ سَامِي؟']],
        en: [['She opened it and saw some money and a family photo.', 'He opened it and saw some money and a family photo.'], ['What should Salma do?', 'What should Sami do?']],
        ch: [{ ic: '🔎', ar: ['تَبْحَثُ عَنْ صَاحِبِهَا', 'يَبْحَثُ عَنْ صَاحِبِهَا'], en: 'Look for the owner', to: 'p4a' }, { ic: '🏠', ar: ['تَأْخُذُهَا إِلَى مَكْتَبِ الحَدِيقَةِ', 'يَأْخُذُهَا إِلَى مَكْتَبِ الحَدِيقَةِ'], en: 'Take it to the park office', to: 'p4b' }] },
      p4a: { sc: 'park', a: { kid: [110, 'walk'], wallet: 'hand', elder: [280, 'm', 'search'] }, next: 'e1',
        ar: [['نَظَرَتْ سَلْمَى حَوْلَهَا، فَرَأَتْ جَدًّا يَبْحَثُ فِي الأَرْضِ قَلِقًا.', 'نَظَرَ سَامِي حَوْلَهُ، فَرَأَى جَدًّا يَبْحَثُ فِي الأَرْضِ قَلِقًا.'], ['فَسَأَلَتْهُ: هَلْ أَضَعْتَ شَيْئًا يَا جَدِّي؟', 'فَسَأَلَهُ: هَلْ أَضَعْتَ شَيْئًا يَا جَدِّي؟']],
        en: [['Salma looked around and saw a grandpa searching the ground, worried.', 'Sami looked around and saw a grandpa searching the ground, worried.'], ['She asked: Did you lose something, grandpa?', 'He asked: Did you lose something, grandpa?']] },
      e1: { sc: 'park', a: { kid: [175, 'give'], wallet: 'give', elder: [250, 'm', 'happy'], hearts: 1 }, end: 'honest',
        ar: ['قَالَ الجَدُّ: نَعَمْ، مَحْفَظَتِي الحَمْرَاءُ!', ['أَعْطَتْهُ سَلْمَى المَحْفَظَةَ، فَقَالَ: بَارَكَ اللَّهُ فِيكِ!', 'أَعْطَاهُ سَامِي المَحْفَظَةَ، فَقَالَ: بَارَكَ اللَّهُ فِيكَ!']],
        en: ['Grandpa said: Yes, my red wallet!', ['Salma gave him the wallet, and he said: May Allah bless you!', 'Sami gave him the wallet, and he said: May Allah bless you!']],
        mar: 'الأَمَانَةُ تَمْلَأُ القُلُوبَ فَرَحًا.', men: 'Honesty fills hearts with joy.' },
      p4b: { sc: 'park', a: { kid: [180, 'give'], wallet: 'give', office: 1 }, next: 'e2',
        ar: [['حَمَلَتْ سَلْمَى المَحْفَظَةَ إِلَى مَكْتَبِ الحَدِيقَةِ.', 'حَمَلَ سَامِي المَحْفَظَةَ إِلَى مَكْتَبِ الحَدِيقَةِ.'], ['وَقَالَتْ: وَجَدْتُ هَذِهِ تَحْتَ المَقْعَدِ.', 'وَقَالَ: وَجَدْتُ هَذِهِ تَحْتَ المَقْعَدِ.']],
        en: [['Salma carried the wallet to the park office.', 'Sami carried the wallet to the park office.'], ['She said: I found this under the bench.', 'He said: I found this under the bench.']] },
      e2: { sc: 'park', a: { kid: [150, 'rose'], elder: [245, 'f', 'happy'], office: 1, hearts: 1 }, end: 'return',
        ar: ['بَعْدَ قَلِيلٍ، جَاءَتْ جَدَّةٌ تَبْحَثُ عَنْ مَحْفَظَتِهَا.', ['فَرِحَتِ الجَدَّةُ، وَأَهْدَتْ سَلْمَى وَرْدَةً جَمِيلَةً.', 'فَرِحَتِ الجَدَّةُ، وَأَهْدَتْ سَامِي وَرْدَةً جَمِيلَةً.']],
        en: ['A little later, a grandma came looking for her wallet.', ['Grandma was so happy, and she gave Salma a lovely rose.', 'Grandma was so happy, and she gave Sami a lovely rose.']],
        mar: 'مَا لَيْسَ لَنَا، نُعِيدُهُ إِلَى أَصْحَابِهِ.', men: 'What is not ours, we give back to its owner.' }
    } }
  ];
  const BY = Object.fromEntries(STORIES.map(s => [s.id, s]));
  const endingsOf = s => Object.entries(s.pages).filter(([, p]) => p.end).map(([k]) => k);
  const TOTAL_ENDS = STORIES.reduce((a, s) => a + endingsOf(s).length, 0);

  /* ---------- أدوات ---------- */
  const lerp = (a, b, t) => a + (b - a) * t;
  const plain = s => String(s).replace(/[ً-ْٰ]/g, '');
  const G = v => Array.isArray(v) ? App.g(v[0], v[1]) : v; // نص حسب جنس الطفل
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const found = () => store.get('storiesEnds', {}) || {};
  function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
  function grad(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
  function rgrad(c, x, y, r, stops) { const g = c.createRadialGradient(x - r * .35, y - r * .4, r * .08, x, y, r * 1.05); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
  function emo(c, e, x, y, s, rot) { c.save(); c.translate(x, y); if (rot) c.rotate(rot); c.font = `${s}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(e, 0, 0); c.restore(); }
  function shadowE(c, x, y, rx, ry, a = .2) { c.save(); c.fillStyle = `rgba(30,30,60,${a})`; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill(); c.restore(); }
  function star5(c, x, y, r, rot = 0, inner = .45) { c.beginPath(); for (let k = 0; k < 10; k++) { const rad = k % 2 ? r * inner : r, a = -Math.PI / 2 + rot + k * Math.PI / 5; c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } c.closePath(); }
  function heart(c, x, y, s, col = '#FF5C8A') { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.beginPath(); c.moveTo(0, .35); c.bezierCurveTo(-1, -.25, -.45, -.95, 0, -.4); c.bezierCurveTo(.45, -.95, 1, -.25, 0, .35); c.fill(); c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-.32, -.42, .14, .09, -.6, 0, TAU); c.fill(); c.restore(); }
  function puff(c, x, y, s, col = '#fff', sh = 'rgba(150,180,220,.45)') {
    const B = [[-1, .2, .55], [-.4, -.2, .75], [.3, -.25, .7], [.9, .15, .55], [0, .25, .6]];
    const path = () => { c.beginPath(); for (const [a, b, r] of B) { c.moveTo(x + a * s + r * s, y + b * s); c.arc(x + a * s, y + b * s, r * s, 0, TAU); } };
    c.fillStyle = col; path(); c.fill();
    c.fillStyle = grad(c, 0, y - s, 0, y + s * .9, ['rgba(255,255,255,0)', 'rgba(255,255,255,0)', sh]); path(); c.fill();
  }
  /* عينان لطيفتان: m = happy|sad|open|closed */
  function eyes(c, x, y, gap, r, m, T, ph = 0) {
    const blink = (m === 'open' || !m) && Math.sin(T * 1.4 + ph) > .985;
    c.lineCap = 'round'; c.lineWidth = r * .55; c.strokeStyle = '#2A1A14'; c.fillStyle = '#2A1A14';
    for (const s of [-1, 1]) {
      const ex = x + s * gap;
      if (m === 'happy' || m === 'closed' || blink) { c.beginPath(); if (m === 'happy') c.arc(ex, y + r * .4, r, Math.PI + .3, -.3); else c.arc(ex, y - r * .2, r, .3, Math.PI - .3); c.stroke(); }
      else { c.beginPath(); c.ellipse(ex, y, r * .85, r * 1.1, 0, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex - r * .3, y - r * .4, r * .35, 0, TAU); c.fill(); c.fillStyle = '#2A1A14';
        if (m === 'sad') { c.beginPath(); c.moveTo(ex - s * r * 1.2, y - r * 1.9); c.lineTo(ex + s * r * .6, y - r * 1.4); c.stroke(); } }
    }
  }
  function cheeks(c, x, y, gap, r) { c.fillStyle = 'rgba(255,110,140,.4)'; c.beginPath(); c.ellipse(x - gap, y, r, r * .6, 0, 0, TAU); c.ellipse(x + gap, y, r, r * .6, 0, 0, TAU); c.fill(); }
  function mouth(c, x, y, r, m) {
    c.strokeStyle = '#7A2E22'; c.fillStyle = '#9C3A2E'; c.lineWidth = r * .35; c.lineCap = 'round';
    if (m === 'open' || m === 'meow') { c.beginPath(); c.ellipse(x, y + r * .2, r * .55, r * (m === 'meow' ? .8 : .6), 0, 0, TAU); c.fill(); }
    else if (m === 'sad') { c.beginPath(); c.arc(x, y + r * 1.1, r * .8, Math.PI + .5, -.5); c.stroke(); }
    else { c.beginPath(); c.arc(x, y - r * .3, r, .45, Math.PI - .45); c.stroke(); }
  }

  /* =====================================================================
     الشخصيات (إحداثيات المشهد 400×300)
     ===================================================================== */
  function cat(c, x, y, s, o, T) {
    const pal = o.mom ? ['#F7F1EA', '#E3D3C3', '#C9AE96'] : ['#FFC27A', '#F59A3C', '#D9742A'];
    const walk = o.st === 'walk' || o.st === 'jump', bob = walk ? Math.abs(Math.sin(T * 6)) * 3 * s : Math.sin(T * 2) * s;
    const jump = o.st === 'jump' ? Math.abs(Math.sin(T * 3)) * 18 * s : 0;
    c.save(); c.translate(x, y); if (o.flip) c.scale(-1, 1);
    shadowE(c, 0, 0, 30 * s, 6 * s, .18 - jump / 400);
    c.translate(0, -jump - bob);
    // الذيل
    c.strokeStyle = pal[2]; c.lineWidth = 7 * s; c.lineCap = 'round';
    const tw = Math.sin(T * (o.st === 'sad' ? 1 : 3)) * .4;
    c.beginPath(); c.moveTo(-22 * s, -14 * s); c.quadraticCurveTo(-46 * s, -20 * s + tw * 20 * s, -40 * s, (o.st === 'sad' ? -6 : -46) * s + tw * 10 * s); c.stroke();
    // الجسم
    c.fillStyle = rgrad(c, 0, -20 * s, 30 * s, pal); c.beginPath(); c.ellipse(0, -18 * s, 28 * s, 18 * s, 0, 0, TAU); c.fill();
    if (!o.mom) { c.strokeStyle = 'rgba(190,90,20,.45)'; c.lineWidth = 3.5 * s; for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(k * 10 * s - 3 * s, -34 * s); c.quadraticCurveTo(k * 10 * s, -26 * s, k * 10 * s + 3 * s, -20 * s); c.stroke(); } }
    // الأرجل
    c.fillStyle = pal[0];
    const lg = walk ? Math.sin(T * 9) * 5 * s : 0;
    for (const [lx, d] of [[-16, 1], [-6, -1], [10, 1], [20, -1]]) { c.beginPath(); c.ellipse(lx * s + lg * d, -3 * s, 6 * s, 5 * s, 0, 0, TAU); c.fill(); }
    // الرأس
    const hx = 24 * s, hy = (o.st === 'up' ? -46 : o.st === 'sad' ? -32 : -40) * s;
    for (const ex of [-12, 12]) { c.fillStyle = pal[1]; c.beginPath(); c.moveTo(hx + ex * s - 9 * s, hy - 8 * s); c.lineTo(hx + ex * s * 1.2, hy - 30 * s); c.lineTo(hx + ex * s + 9 * s, hy - 10 * s); c.closePath(); c.fill(); c.fillStyle = '#FFB0B8'; c.beginPath(); c.moveTo(hx + ex * s - 4 * s, hy - 12 * s); c.lineTo(hx + ex * s * 1.15, hy - 24 * s); c.lineTo(hx + ex * s + 4 * s, hy - 12 * s); c.fill(); }
    c.fillStyle = rgrad(c, hx, hy, 22 * s, pal); c.beginPath(); c.ellipse(hx, hy, 22 * s, 19 * s, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(hx - 8 * s, hy - 9 * s, 7 * s, 3 * s, -.4, 0, TAU); c.fill();
    const em = o.st === 'sad' ? 'sad' : o.st === 'happy' || o.st === 'hug' ? 'happy' : o.st === 'meow' ? 'closed' : 'open';
    eyes(c, hx, hy - 1 * s, 8 * s, 3 * s, em, T, o.mom ? 2 : 0);
    if (o.st === 'sad') { const k = (T * .7) % 1; c.fillStyle = `rgba(110,190,255,${1 - k})`; c.beginPath(); c.ellipse(hx + 9 * s, hy + 4 * s + k * 12 * s, 2 * s, 3 * s, 0, 0, TAU); c.fill(); }
    cheeks(c, hx, hy + 6 * s, 13 * s, 4 * s);
    c.fillStyle = '#FF7F95'; c.beginPath(); c.moveTo(hx - 3 * s, hy + 4 * s); c.lineTo(hx + 3 * s, hy + 4 * s); c.lineTo(hx, hy + 7 * s); c.fill();
    mouth(c, hx, hy + 10 * s, 3 * s, o.st === 'meow' ? 'meow' : o.st === 'sad' ? 'sad' : 'smile');
    c.strokeStyle = 'rgba(80,40,20,.45)'; c.lineWidth = 1.2 * s; for (const sd of [-1, 1]) for (const k of [-1, 1]) { c.beginPath(); c.moveTo(hx + sd * 10 * s, hy + 6 * s); c.lineTo(hx + sd * 24 * s, hy + 4 * s + k * 4 * s); c.stroke(); }
    if (o.bow) { c.fillStyle = '#FF5C8A'; c.beginPath(); c.ellipse(hx + 12 * s, hy - 15 * s, 6 * s, 4 * s, .5, 0, TAU); c.ellipse(hx + 20 * s, hy - 11 * s, 6 * s, 4 * s, .5, 0, TAU); c.fill(); }
    c.restore();
  }
  function bird(c, x, y, s, T, fly) {
    c.save(); c.translate(x, y);
    const fl = fly ? Math.sin(T * 14) : .2;
    c.fillStyle = rgrad(c, 0, 0, 12 * s, ['#9FE0FF', '#4DB4F2', '#2A86C9']); c.beginPath(); c.ellipse(0, 0, 13 * s, 10 * s, 0, 0, TAU); c.fill();
    c.fillStyle = '#2A86C9'; c.beginPath(); c.ellipse(-3 * s, -2 * s - fl * 8 * s, 10 * s, 4 * s, -.4 - fl * .6, 0, TAU); c.fill();
    c.fillStyle = '#FFF3D6'; c.beginPath(); c.ellipse(3 * s, 4 * s, 7 * s, 5 * s, 0, 0, TAU); c.fill();
    c.fillStyle = '#FFB020'; c.beginPath(); c.moveTo(12 * s, -2 * s); c.lineTo(19 * s, 0); c.lineTo(12 * s, 2 * s); c.fill();
    c.fillStyle = '#1A1A2A'; c.beginPath(); c.arc(7 * s, -3 * s, 2 * s, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(6.4 * s, -3.6 * s, .8 * s, 0, TAU); c.fill();
    c.restore();
  }
  function butterfly(c, x, y, s, T) {
    c.save(); c.translate(x, y); const f = .35 + .65 * Math.abs(Math.sin(T * 9));
    for (const sd of [-1, 1]) { c.save(); c.scale(sd * f, 1); c.fillStyle = grad(c, 0, -12 * s, 14 * s, 8 * s, ['#FF8BC2', '#B26BFF']); c.beginPath(); c.ellipse(8 * s, -6 * s, 9 * s, 7 * s, -.5, 0, TAU); c.fill(); c.fillStyle = '#FFC65C'; c.beginPath(); c.ellipse(7 * s, 6 * s, 6 * s, 5 * s, .4, 0, TAU); c.fill(); c.restore(); }
    c.fillStyle = '#4A2A5A'; c.beginPath(); c.ellipse(0, 0, 2 * s, 9 * s, 0, 0, TAU); c.fill();
    c.restore();
  }
  function penguin(c, x, y, s, o, T) {
    const st = o.st, hop = st === 'happy' ? Math.abs(Math.sin(T * 5)) * 6 * s : 0, sway = Math.sin(T * 2 + (o.ph || 0)) * .05;
    c.save(); c.translate(x, y); shadowE(c, 0, 0, 22 * s, 5 * s);
    c.translate(0, -hop); c.rotate(sway);
    // القدمان
    c.fillStyle = '#FF9F2E'; c.beginPath(); c.ellipse(-9 * s, -2 * s, 8 * s, 4 * s, 0, 0, TAU); c.ellipse(9 * s, -2 * s, 8 * s, 4 * s, 0, 0, TAU); c.fill();
    // الجسم
    c.fillStyle = rgrad(c, 0, -34 * s, 30 * s, ['#4A5F9E', '#27356B', '#18214A']); c.beginPath(); c.ellipse(0, -30 * s, 24 * s, 30 * s, 0, 0, TAU); c.fill();
    c.fillStyle = rgrad(c, 0, -24 * s, 18 * s, ['#FFFFFF', '#F2F4FA', '#D9DEEC']); c.beginPath(); c.ellipse(0, -24 * s, 17 * s, 22 * s, 0, 0, TAU); c.fill();
    // الجناحان
    const wv = st === 'wave' ? Math.sin(T * 8) * .5 - .9 : st === 'give' ? -1.1 : st === 'happy' ? Math.sin(T * 10) * .3 - .6 : 0;
    for (const sd of [-1, 1]) { c.save(); c.translate(sd * 21 * s, -36 * s); c.rotate(sd * (.25 + (sd > 0 ? -wv : (st === 'happy' ? -wv : 0)))); c.fillStyle = '#27356B'; c.beginPath(); c.ellipse(0, 12 * s, 6 * s, 16 * s, 0, 0, TAU); c.fill(); c.restore(); }
    // الوجه
    const hy = -44 * s;
    const em = st === 'sad' ? 'sad' : st === 'happy' || st === 'give' ? 'happy' : 'open';
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(-7 * s, hy, 7 * s, 7.5 * s, 0, 0, TAU); c.ellipse(7 * s, hy, 7 * s, 7.5 * s, 0, 0, TAU); c.fill();
    eyes(c, 0, hy, 7 * s, 3 * s, em, T, o.ph || 0);
    cheeks(c, 0, hy + 8 * s, 12 * s, 3.5 * s);
    c.fillStyle = '#FFA21F'; c.beginPath(); c.moveTo(-5 * s, hy + 5 * s); c.lineTo(5 * s, hy + 5 * s); c.lineTo(0, hy + (st === 'happy' || st === 'give' ? 13 : 11) * s); c.closePath(); c.fill();
    if (st === 'sad') { const k = (T * .7) % 1; c.fillStyle = `rgba(110,190,255,${1 - k})`; c.beginPath(); c.ellipse(9 * s, hy + 6 * s + k * 10 * s, 2 * s, 3 * s, 0, 0, TAU); c.fill(); }
    // الوشاح
    c.fillStyle = o.scarf || '#3FB3F2'; rr(c, -18 * s, -36 * s, 36 * s, 7 * s, 3.5 * s); c.fill(); rr(c, 8 * s, -32 * s, 7 * s, 16 * s, 3 * s); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-12 * s, -35 * s, 3 * s, 5 * s); c.fillRect(0, -35 * s, 3 * s, 5 * s);
    if (o.bow) { c.fillStyle = o.scarf; c.beginPath(); c.ellipse(-8 * s, -58 * s, 6 * s, 4 * s, -.5, 0, TAU); c.ellipse(-1 * s, -60 * s, 6 * s, 4 * s, .5, 0, TAU); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(-10 * s, -52 * s, 6 * s, 3 * s, -.5, 0, TAU); c.fill();
    if (o.fish) fish(c, 18 * s, -22 * s, s * .9, '#FFB347', -.4);
    c.restore();
  }
  function fish(c, x, y, s, col = '#5CC8FF', rot = 0) {
    c.save(); c.translate(x, y); c.rotate(rot);
    c.fillStyle = grad(c, -14 * s, 0, 14 * s, 0, [col, '#fff']); c.beginPath(); c.ellipse(0, 0, 13 * s, 7 * s, 0, 0, TAU); c.fill();
    c.fillStyle = col; c.beginPath(); c.moveTo(-11 * s, 0); c.lineTo(-20 * s, -7 * s); c.lineTo(-20 * s, 7 * s); c.closePath(); c.fill();
    c.fillStyle = '#1A2238'; c.beginPath(); c.arc(7 * s, -2 * s, 1.6 * s, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(1 * s, -3 * s, 5 * s, 1.5 * s, 0, 0, TAU); c.fill();
    c.restore();
  }
  function camel(c, x, y, s, o, T) {
    const st = o.st, walk = st === 'walk' || st === 'buckets';
    c.save(); c.translate(x, y); shadowE(c, 0, 0, 50 * s, 7 * s);
    const lg = walk ? Math.sin(T * 5) : 0, bob = walk ? Math.abs(Math.sin(T * 5)) * 2 * s : Math.sin(T * 2) * s;
    const pal = ['#F6D29A', '#E0AE68', '#B98545'];
    // الأرجل
    c.lineCap = 'round';
    for (const [lx, d, back] of [[-28, 1, 1], [-18, -1, 0], [22, -1, 1], [32, 1, 0]]) {
      const sw = lg * d * 6 * s + (st === 'dig' && lx > 20 && !back ? Math.sin(T * 8) * 8 * s : 0);
      c.strokeStyle = back ? pal[2] : pal[1]; c.lineWidth = 8 * s; c.beginPath(); c.moveTo(lx * s, -40 * s); c.lineTo(lx * s + sw, -2 * s); c.stroke();
      c.fillStyle = '#8A6234'; c.beginPath(); c.ellipse(lx * s + sw, -2 * s, 6 * s, 3 * s, 0, 0, TAU); c.fill();
    }
    c.translate(0, -bob);
    // الجسم والسنام
    c.fillStyle = rgrad(c, 0, -52 * s, 50 * s, pal);
    c.beginPath(); c.ellipse(0, -48 * s, 42 * s, 18 * s, 0, 0, TAU); c.fill();
    c.beginPath(); c.ellipse(-2 * s, -62 * s, 22 * s, 18 * s, 0, Math.PI, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(-8 * s, -70 * s, 10 * s, 4 * s, -.3, 0, TAU); c.fill();
    // سرج ملوّن
    c.fillStyle = '#E2463F'; rr(c, -18 * s, -60 * s, 34 * s, 10 * s, 4 * s); c.fill();
    c.fillStyle = '#FFD45C'; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(-14 * s + k * 7 * s, -50 * s, 2.2 * s, 0, TAU); c.fill(); }
    // الذيل
    c.strokeStyle = pal[2]; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(-40 * s, -50 * s); c.quadraticCurveTo(-48 * s, -40 * s + Math.sin(T * 3) * 3 * s, -45 * s, -32 * s); c.stroke();
    // الرقبة والرأس
    const nod = st === 'happy' ? Math.sin(T * 4) * .08 : st === 'dig' ? .15 : st === 'look' || st === 'think' ? -.05 : 0;
    c.save(); c.translate(34 * s, -52 * s); c.rotate(nod);
    c.strokeStyle = pal[1]; c.lineWidth = 14 * s; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(18 * s, -12 * s, 16 * s, -36 * s); c.stroke();
    c.fillStyle = rgrad(c, 22 * s, -42 * s, 16 * s, pal); c.beginPath(); c.ellipse(22 * s, -42 * s, 15 * s, 11 * s, .15, 0, TAU); c.fill();
    c.fillStyle = pal[2]; c.beginPath(); c.ellipse(12 * s, -52 * s, 4 * s, 6 * s, -.5, 0, TAU); c.fill();
    eyes(c, 22 * s, -46 * s, 0, 2.6 * s, st === 'happy' ? 'happy' : 'open', T);
    c.fillStyle = '#2A1A14'; c.beginPath(); c.arc(34 * s, -41 * s, 1.5 * s, 0, TAU); c.fill();
    cheeks(c, 26 * s, -38 * s, 0, 3.5 * s);
    mouth(c, 30 * s, -34 * s, 3 * s, 'smile');
    c.restore();
    if (st === 'buckets') { for (const bx of [-12, 14]) { const by = -28 * s; c.strokeStyle = '#6B5A4A'; c.lineWidth = 1.5 * s; c.beginPath(); c.moveTo(bx * s - 7 * s, by); c.lineTo(bx * s, -50 * s); c.lineTo(bx * s + 7 * s, by); c.stroke(); c.fillStyle = grad(c, bx * s - 8 * s, 0, bx * s + 8 * s, 0, ['#B8C4CE', '#7E8C98']); c.beginPath(); c.moveTo(bx * s - 8 * s, by); c.lineTo(bx * s + 8 * s, by); c.lineTo(bx * s + 6 * s, by + 14 * s); c.lineTo(bx * s - 6 * s, by + 14 * s); c.closePath(); c.fill(); c.fillStyle = '#5CC2F2'; c.beginPath(); c.ellipse(bx * s, by, 7.5 * s, 2 * s, 0, 0, TAU); c.fill(); } }
    if (st === 'think') { c.fillStyle = '#fff'; for (const [bx, by, r] of [[60, -110, 3], [68, -122, 5]]) { c.beginPath(); c.arc(bx * s, by * s, r * s, 0, TAU); c.fill(); } puff(c, 84 * s, -142 * s, 14 * s); emo(c, '💭', 84 * s, -142 * s, 14 * s); }
    c.restore();
  }
  function palmTree(c, x, y, s, thirst, T, dates) {
    c.save(); c.translate(x, y);
    shadowE(c, 0, 0, 30 * s, 5 * s);
    // الجذع
    for (let k = 0; k < 9; k++) { const yy = -k * 14 * s, xx = Math.sin(k * .25) * 6 * s; c.fillStyle = k % 2 ? '#B07A45' : '#C48C52'; c.beginPath(); c.ellipse(xx, yy - 7 * s, 9 * s - k * .3 * s, 8 * s, 0, 0, TAU); c.fill(); }
    const top = [Math.sin(9 * .25) * 6 * s, -126 * s];
    const green = ['#7BD653', '#3E9E34'], dry = ['#D8B66A', '#A98A3E'];
    const sway = Math.sin(T * 1.3) * .05;
    for (let k = 0; k < 8; k++) {
      const base = -Math.PI / 2 + (k - 3.5) * .42, droop = thirst * (.6 + Math.abs(k - 3.5) * .08);
      const a = base + (base < -Math.PI / 2 ? -droop : droop) * .9 + sway;
      c.save(); c.translate(top[0], top[1]); c.rotate(a + Math.PI / 2);
      const col = thirst > .3 ? dry : green;
      c.fillStyle = grad(c, 0, 0, 0, -60 * s, [col[1], col[0]]);
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(14 * s, -30 * s, 4 * s, -62 * s + thirst * 14 * s); c.quadraticCurveTo(-8 * s, -30 * s, 0, 0); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 1.2 * s; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(5 * s, -30 * s, 4 * s, -58 * s + thirst * 14 * s); c.stroke();
      c.restore();
    }
    if (dates) for (const [dx, dy] of [[-10, 6], [8, 8], [-2, 12], [14, 2], [-16, 0]]) { c.fillStyle = rgrad(c, top[0] + dx * s, top[1] + dy * s, 5 * s, ['#C8662E', '#8E3B16', '#6A2A0E']); c.beginPath(); c.ellipse(top[0] + dx * s, top[1] + dy * s, 4 * s, 5.5 * s, 0, 0, TAU); c.fill(); }
    // وجه النخلة
    const fy = -70 * s;
    eyes(c, 0, fy, 6 * s, 2.4 * s, thirst > .5 ? 'sad' : 'happy', T, 1);
    mouth(c, 0, fy + 9 * s, 3 * s, thirst > .5 ? 'sad' : 'smile');
    c.restore();
  }
  function cloudChar(c, x, y, s, o, T) {
    const grey = o.grey || 0;
    c.save(); c.translate(x, y + Math.sin(T * 1.5) * 3);
    const sq = o.mood === 'try' ? 1 + Math.sin(T * 10) * .04 : 1;
    c.scale(sq, 2 - sq);
    puff(c, 0, 0, 30 * s, grey ? `rgb(${lerp(255, 175, grey)},${lerp(255, 185, grey)},${lerp(255, 205, grey)})` : '#fff', grey ? 'rgba(90,100,130,.5)' : 'rgba(150,180,230,.5)');
    const em = o.mood === 'sad' ? 'sad' : o.mood === 'try' ? 'closed' : o.mood === 'happy' ? 'happy' : 'open';
    eyes(c, 0, 0, 10 * s, 3.5 * s, em, T);
    cheeks(c, 0, 9 * s, 17 * s, 5 * s);
    mouth(c, 0, 12 * s, 4 * s, o.mood === 'sad' ? 'sad' : o.mood === 'try' ? 'open' : 'smile');
    c.restore();
  }
  function wind(c, x, y, s, T) {
    c.save(); c.translate(x, y);
    c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 4 * s; c.lineCap = 'round';
    for (let k = 0; k < 3; k++) { const o = (T * 60 + k * 30) % 90; c.globalAlpha = 1 - o / 90; c.beginPath(); c.moveTo(20 * s + o * s, -10 * s + k * 10 * s); c.quadraticCurveTo(40 * s + o * s, -18 * s + k * 10 * s, 60 * s + o * s, -8 * s + k * 10 * s); c.stroke(); }
    c.globalAlpha = 1;
    c.fillStyle = rgrad(c, 0, 0, 22 * s, ['#E8FBFF', '#B5E8F7', '#7FCDE8']); c.beginPath(); c.arc(0, 0, 20 * s, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 2 * s; c.beginPath(); c.arc(-4 * s, -4 * s, 12 * s, -2.8, -.8); c.stroke();
    eyes(c, -2 * s, -3 * s, 6 * s, 2.4 * s, 'happy', T);
    c.fillStyle = '#5A8FB0'; c.beginPath(); c.ellipse(9 * s, 6 * s, 4 * s, 3 * s, 0, 0, TAU); c.fill();
    c.restore();
  }
  function starChar(c, x, y, s, o, T) {
    const g = o.glow;
    c.save(); c.translate(x, y + Math.sin(T * 1.8) * 3);
    const gr = c.createRadialGradient(0, 0, 4, 0, 0, 40 * s * (.6 + g)); gr.addColorStop(0, `rgba(255,236,150,${.25 + g * .5})`); gr.addColorStop(1, 'rgba(255,236,150,0)'); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 40 * s * (.6 + g), 0, TAU); c.fill();
    if (g > .9) { c.save(); c.rotate(T * .4); c.strokeStyle = 'rgba(255,240,170,.7)'; c.lineWidth = 3 * s; c.lineCap = 'round'; for (let k = 0; k < 12; k++) { c.rotate(TAU / 12); const L = (34 + Math.sin(T * 6 + k) * 6) * s; c.beginPath(); c.moveTo(28 * s, 0); c.lineTo(L + 10 * s, 0); c.stroke(); } c.restore(); }
    c.rotate(Math.sin(T * 1.2) * .08);
    c.fillStyle = rgrad(c, 0, -4 * s, 24 * s, ['#FFF7C2', '#FFD84A', '#F2A60F']); star5(c, 0, 0, 24 * s, 0, .55); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2 * s; c.lineJoin = 'round'; star5(c, 0, 0, 24 * s, 0, .55); c.stroke();
    const m = o.mood, em = m === 'shy' ? 'closed' : m === 'brave' ? 'closed' : m === 'happy' ? 'happy' : m === 'worry' ? 'sad' : 'open';
    eyes(c, 0, 0, 6 * s, 2.2 * s, em, T);
    cheeks(c, 0, 6 * s, 10 * s, 3 * s);
    mouth(c, 0, 8 * s, 2.6 * s, m === 'worry' ? 'sad' : m === 'think' ? 'open' : 'smile');
    c.restore();
  }
  function boat(c, x, y, s, T, lit) {
    c.save(); c.translate(x, y); c.rotate(Math.sin(T * 1.6) * .08);
    c.fillStyle = grad(c, 0, -6 * s, 0, 12 * s, ['#E07A4A', '#A84B26']); c.beginPath(); c.moveTo(-34 * s, -6 * s); c.lineTo(34 * s, -6 * s); c.quadraticCurveTo(26 * s, 12 * s, 0, 12 * s); c.quadraticCurveTo(-26 * s, 12 * s, -34 * s, -6 * s); c.fill();
    c.fillStyle = '#FFE7B0'; c.fillRect(-30 * s, -8 * s, 60 * s, 3 * s);
    c.strokeStyle = '#6B4226'; c.lineWidth = 2.5 * s; c.beginPath(); c.moveTo(0, -6 * s); c.lineTo(0, -56 * s); c.stroke();
    c.fillStyle = grad(c, 0, -56 * s, 30 * s, 0, ['#FFFFFF', '#E3EAF2']); c.beginPath(); c.moveTo(2 * s, -54 * s); c.lineTo(30 * s, -12 * s); c.lineTo(2 * s, -12 * s); c.closePath(); c.fill();
    // فانوس
    const lx = -18 * s, ly = -18 * s;
    if (lit) { const g = c.createRadialGradient(lx, ly, 1, lx, ly, 22 * s); g.addColorStop(0, 'rgba(255,210,110,.7)'); g.addColorStop(1, 'rgba(255,210,110,0)'); c.fillStyle = g; c.beginPath(); c.arc(lx, ly, 22 * s, 0, TAU); c.fill(); }
    c.fillStyle = '#F2C14E'; rr(c, lx - 4 * s, ly - 6 * s, 8 * s, 11 * s, 2 * s); c.fill(); c.fillStyle = '#FFF2B8'; c.fillRect(lx - 2 * s, ly - 3 * s, 4 * s, 6 * s);
    c.restore();
  }
  /* الطفل (البطل حسب جنس اللاعب) */
  function kid(c, x, y, s, o, T) {
    const girl = App.g(true, false), st = o.st;
    const top = girl ? ['#FFA6CB', '#F06A9C', '#C94677'] : ['#7FC0FF', '#3D8BFD', '#2462C9'];
    const hair = girl ? ['#7A4A2E', '#4E2C18'] : ['#5A3A24', '#33200F'];
    const walk = st === 'walk' || st === 'play';
    const bob = walk ? Math.abs(Math.sin(T * 6)) * 2 * s : Math.sin(T * 2) * .8 * s;
    c.save(); c.translate(x, y); if (o.flip) c.scale(-1, 1);
    shadowE(c, 0, 0, 20 * s, 4 * s);
    // الساقان
    for (const sd of [-1, 1]) {
      const sw = walk ? Math.sin(T * 6) * sd * 4 * s : 0;
      c.fillStyle = girl ? '#F7C29C' : grad(c, 0, -26 * s, 0, 0, ['#5C6FA8', '#3E4E80']); rr(c, sd * 7 * s - 4.5 * s + sw, -28 * s, 9 * s, 26 * s, 4 * s); c.fill();
      c.fillStyle = girl ? '#FF7AA8' : '#3A3A48'; c.beginPath(); c.ellipse(sd * 7 * s + sw + 2 * s, -2 * s, 7 * s, 4 * s, 0, 0, TAU); c.fill();
    }
    c.translate(0, -bob);
    // الجسم
    c.fillStyle = grad(c, -16 * s, -64 * s, 16 * s, -24 * s, top);
    c.beginPath();
    if (girl) { c.moveTo(-11 * s, -62 * s); c.quadraticCurveTo(0, -65 * s, 11 * s, -62 * s); c.quadraticCurveTo(16 * s, -40 * s, 20 * s, -24 * s); c.quadraticCurveTo(0, -20 * s, -20 * s, -24 * s); c.quadraticCurveTo(-16 * s, -40 * s, -11 * s, -62 * s); }
    else { c.roundRect(-14 * s, -63 * s, 28 * s, 38 * s, 9 * s); }
    c.fill();
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(-6 * s, -52 * s, 3.5 * s, 8 * s, .3, 0, TAU); c.fill();
    // الذراعان
    const arm = (sd, hx, hy) => { c.strokeStyle = top[1]; c.lineWidth = 7 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(sd * 12 * s, -58 * s); c.lineTo(hx * s, hy * s); c.stroke(); c.fillStyle = '#F7C29C'; c.beginPath(); c.arc(hx * s, hy * s, 4.5 * s, 0, TAU); c.fill(); return [hx * s, hy * s]; };
    let hands;
    if (st === 'point') hands = [arm(-1, -16, -32), arm(1, 30, -48)];
    else if (st === 'hold' || st === 'give' || st === 'rose') hands = [arm(-1, 10, -46), arm(1, 22, -46)];
    else if (st === 'play') { const k = Math.sin(T * 6); hands = [arm(-1, -20, -36 + k * 3), arm(1, 22, -38 - k * 6)]; }
    else hands = [arm(-1, -18, -34 + Math.sin(T * 6) * 2), arm(1, 18, -34 - Math.sin(T * 6) * 2)];
    // الرأس
    const hy = -80 * s;
    if (girl) for (const sd of [-1, 1]) { c.fillStyle = rgrad(c, sd * 19 * s, hy + 2 * s, 8 * s, [hair[0], hair[0], hair[1]]); c.beginPath(); c.arc(sd * 19 * s, hy + 2 * s, 7.5 * s, 0, TAU); c.fill(); c.fillStyle = '#FF5C8A'; c.beginPath(); c.ellipse(sd * 16 * s, hy - 6 * s, 4 * s, 2.5 * s, sd * .6, 0, TAU); c.fill(); }
    c.fillStyle = '#F2B48A'; c.fillRect(-3 * s, -67 * s, 6 * s, 6 * s);
    c.fillStyle = rgrad(c, 0, hy, 18 * s, ['#FFE9D8', '#FBCBA6', '#E9A981']); c.beginPath(); c.arc(0, hy, 18 * s, 0, TAU); c.fill();
    c.fillStyle = grad(c, 0, hy - 19 * s, 0, hy, hair); c.beginPath(); c.arc(0, hy, 18.6 * s, Math.PI * 1.02, Math.PI * 1.98);
    if (girl) { c.quadraticCurveTo(12 * s, hy - 6 * s, 2 * s, hy - 10 * s); c.quadraticCurveTo(-9 * s, hy - 5 * s, -18 * s, hy - 1 * s); }
    else { c.lineTo(15 * s, hy - 8 * s); c.quadraticCurveTo(5 * s, hy - 11 * s, -3 * s, hy - 8 * s); c.quadraticCurveTo(-12 * s, hy - 9 * s, -18 * s, hy - 2 * s); }
    c.closePath(); c.fill();
    eyes(c, 0, hy + 1 * s, 6.5 * s, 2.4 * s, st === 'happy' || st === 'rose' || st === 'give' ? 'happy' : 'open', T);
    cheeks(c, 0, hy + 7 * s, 10.5 * s, 3 * s);
    mouth(c, 0, hy + 9 * s, 2.8 * s, st === 'point' ? 'open' : 'smile');
    c.restore();
    return hands.map(([hx, hh]) => [x + (o.flip ? -hx : hx), y + hh - bob]);
  }
  function elder(c, x, y, s, o, T) {
    const f = o.g === 'f', st = o.st;
    c.save(); c.translate(x, y); c.scale(-1, 1); // ينظر إلى اليسار نحو الطفل
    shadowE(c, 0, 0, 24 * s, 5 * s);
    const bend = st === 'search' ? .25 : 0;
    // الساقان
    c.fillStyle = f ? '#6A5A8A' : '#7B8798'; rr(c, -10 * s, -30 * s, 9 * s, 29 * s, 4 * s); c.fill(); rr(c, 2 * s, -30 * s, 9 * s, 29 * s, 4 * s); c.fill();
    c.fillStyle = '#4A3A30'; c.beginPath(); c.ellipse(-5 * s, -2 * s, 8 * s, 4 * s, 0, 0, TAU); c.ellipse(7 * s, -2 * s, 8 * s, 4 * s, 0, 0, TAU); c.fill();
    c.save(); c.translate(0, -30 * s); c.rotate(-bend);
    // الجسم
    const coat = f ? ['#B79CE8', '#8F6FD0'] : ['#9FC9A8', '#5E9E70'];
    c.fillStyle = grad(c, 0, -46 * s, 0, 0, coat); rr(c, -17 * s, -46 * s, 34 * s, f ? 50 * s : 46 * s, 12 * s); c.fill();
    c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(-8 * s, -34 * s, 4 * s, 10 * s, .2, 0, TAU); c.fill();
    // العصا والذراع
    c.strokeStyle = '#8A5A2E'; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(-22 * s, -24 * s); c.lineTo(-24 * s, 30 * s); c.stroke(); c.beginPath(); c.arc(-18 * s, -24 * s, 4 * s, Math.PI, TAU); c.stroke();
    c.strokeStyle = coat[1]; c.lineWidth = 8 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(-12 * s, -40 * s); c.lineTo(-20 * s, -24 * s); c.stroke();
    if (st === 'happy') { c.beginPath(); c.moveTo(12 * s, -40 * s); c.lineTo(22 * s, -56 * s + Math.sin(T * 5) * 3 * s); c.stroke(); c.fillStyle = '#F2C29A'; c.beginPath(); c.arc(22 * s, -58 * s + Math.sin(T * 5) * 3 * s, 4.5 * s, 0, TAU); c.fill(); }
    // الرأس
    const hy = -62 * s;
    c.fillStyle = rgrad(c, 0, hy, 17 * s, ['#FBE2CF', '#EFC09C', '#D79F79']); c.beginPath(); c.arc(0, hy, 16 * s, 0, TAU); c.fill();
    if (f) { c.fillStyle = grad(c, 0, hy - 20 * s, 0, hy + 20 * s, ['#E59AC0', '#C46A98']); c.beginPath(); c.arc(0, hy - 1 * s, 19 * s, Math.PI * .85, Math.PI * 2.15); c.quadraticCurveTo(18 * s, hy + 26 * s, 0, hy + 26 * s); c.quadraticCurveTo(-18 * s, hy + 26 * s, -18 * s, hy + 6 * s); c.closePath(); c.fill(); c.fillStyle = rgrad(c, 0, hy, 13 * s, ['#FBE2CF', '#EFC09C']); c.beginPath(); c.ellipse(0, hy + 2 * s, 12 * s, 13 * s, 0, 0, TAU); c.fill(); }
    else { c.fillStyle = '#F2F2F2'; c.beginPath(); c.arc(0, hy, 16.5 * s, Math.PI * 1.05, Math.PI * 1.95); c.lineTo(10 * s, hy - 10 * s); c.lineTo(-10 * s, hy - 10 * s); c.fill(); c.beginPath(); c.moveTo(-12 * s, hy + 4 * s); c.quadraticCurveTo(0, hy + 26 * s, 12 * s, hy + 4 * s); c.quadraticCurveTo(0, hy + 12 * s, -12 * s, hy + 4 * s); c.fill(); }
    eyes(c, 0, hy - 1 * s, 6 * s, 2 * s, st === 'happy' ? 'happy' : 'open', T);
    c.strokeStyle = '#6A5040'; c.lineWidth = 1.2 * s; c.beginPath(); c.arc(-6 * s, hy - 1 * s, 4.5 * s, 0, TAU); c.arc(6 * s, hy - 1 * s, 4.5 * s, 0, TAU); c.stroke();
    cheeks(c, 0, hy + 6 * s, 10 * s, 3 * s);
    mouth(c, 0, hy + 8 * s, 2.6 * s, st === 'search' ? 'sad' : 'smile');
    c.restore();
    if (st === 'search') { emo(c, '❓', -10 * s, -110 * s + Math.sin(T * 3) * 3 * s, 14 * s); }
    c.restore();
  }
  function wallet(c, x, y, s, open) {
    c.save(); c.translate(x, y);
    c.fillStyle = grad(c, 0, -8 * s, 0, 8 * s, ['#FF6B6B', '#C9363C']); rr(c, -11 * s, -8 * s, 22 * s, 15 * s, 3 * s); c.fill();
    c.fillStyle = '#FFD45C'; c.beginPath(); c.arc(8 * s, -1 * s, 2 * s, 0, TAU); c.fill();
    if (open) { c.fillStyle = '#7BC67E'; c.fillRect(-9 * s, -14 * s, 12 * s, 7 * s); c.fillStyle = '#fff'; c.fillRect(2 * s, -15 * s, 8 * s, 9 * s); c.fillStyle = '#9CC9F0'; c.fillRect(3 * s, -14 * s, 6 * s, 7 * s); }
    c.restore();
  }

  /* =====================================================================
     المشاهد
     ===================================================================== */
  function hearts(c, T, n = 5) { for (let i = 0; i < n; i++) { const k = (T * .35 + i / n) % 1; c.globalAlpha = Math.sin(k * Math.PI); heart(c, 80 + i * 60 + Math.sin(T + i) * 10, 200 - k * 150, 7 + (i % 3) * 2); } c.globalAlpha = 1; }
  function sparkles(c, T, n, area, col = '255,240,170') { for (let i = 0; i < n; i++) { const x = area[0] + ((i * 73) % 100) / 100 * area[2], y = area[1] + ((i * 37) % 100) / 100 * area[3], a = .3 + .7 * Math.abs(Math.sin(T * 1.6 + i)); c.fillStyle = `rgba(${col},${a})`; star5(c, x, y, 2 + (i % 3), i * .7); c.fill(); } }
  const SCENES = {
    souq(c, T, a) {
      c.fillStyle = grad(c, 0, 0, 0, 220, ['#FFE2B0', '#FFF2DA']); c.fillRect(0, 0, 400, 220);
      // جدران وأقواس السوق
      c.fillStyle = '#F2CF9C'; c.fillRect(0, 40, 400, 170);
      for (let i = 0; i < 4; i++) { const x = 20 + i * 100; c.fillStyle = '#D9A86A'; c.beginPath(); c.moveTo(x, 210); c.lineTo(x, 95); c.arc(x + 40, 95, 40, Math.PI, TAU); c.lineTo(x + 80, 210); c.fill(); c.fillStyle = grad(c, 0, 60, 0, 210, ['#7A4A2A', '#5A3420']); c.beginPath(); c.moveTo(x + 8, 210); c.lineTo(x + 8, 98); c.arc(x + 40, 98, 32, Math.PI, TAU); c.lineTo(x + 72, 210); c.fill(); }
      // المظلات والبضائع
      const goods = [['#E2463F', '#FFF', '🌶️'], ['#2E9E6A', '#FFF', '🧺'], ['#3D7FD6', '#FFF', '🏺'], ['#F2A20F', '#FFF', '🌰']];
      for (let i = 0; i < 4; i++) {
        const x = 20 + i * 100;
        for (let k = 0; k < 5; k++) { c.fillStyle = k % 2 ? goods[i][1] : goods[i][0]; c.beginPath(); c.moveTo(x - 4 + k * 17.6, 118); c.lineTo(x + 13.6 + k * 17.6, 118); c.lineTo(x + 13.6 + k * 17.6, 134); c.quadraticCurveTo(x + 4.8 + k * 17.6, 142, x - 4 + k * 17.6, 134); c.fill(); }
        c.fillStyle = '#B9874F'; rr(c, x + 4, 180, 72, 30, 6); c.fill(); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x + 8, 183, 64, 3);
        if (i === 3 && a.dates) { for (let k = 0; k < 9; k++) { c.fillStyle = '#7A3414'; c.beginPath(); c.ellipse(x + 16 + (k % 5) * 12, 176 - Math.floor(k / 5) * 7, 6, 4, 0, 0, TAU); c.fill(); } c.font = `900 13px ${FONT}`; c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText('تَمْر', x + 40, 200); }
        else emo(c, goods[i][2], x + 40, 168, 26);
      }
      // فوانيس
      for (let i = 0; i < 5; i++) { const x = 40 + i * 80, y = 30 + Math.sin(T * 1.5 + i) * 2; c.strokeStyle = '#8A6234'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, y); c.stroke(); const g = c.createRadialGradient(x, y + 10, 1, x, y + 10, 26); g.addColorStop(0, 'rgba(255,200,90,.5)'); g.addColorStop(1, 'rgba(255,200,90,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y + 10, 26, 0, TAU); c.fill(); c.fillStyle = ['#E2463F', '#3D7FD6', '#2E9E6A', '#F2A20F', '#B26BFF'][i]; c.beginPath(); c.ellipse(x, y + 10, 7, 10, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,240,180,.7)'; c.beginPath(); c.ellipse(x - 2, y + 7, 2, 4, 0, 0, TAU); c.fill(); }
      // الأرضية
      c.fillStyle = grad(c, 0, 210, 0, 300, ['#E9C99A', '#D3AC77']); c.fillRect(0, 210, 400, 90);
      c.strokeStyle = 'rgba(160,110,60,.25)'; c.lineWidth = 2; for (let y = 225; y < 300; y += 18) { c.beginPath(); c.moveTo(0, y); c.lineTo(400, y); c.stroke(); for (let x = (y / 18 % 2) * 20; x < 400; x += 40) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 18); c.stroke(); } }
      if (a.mom) cat(c, a.mom[0], 262, 1.25, { mom: true, st: a.mom[1] === 'hug' ? 'happy' : 'walk', flip: a.mom[1] === 'hug', bow: false }, T);
      if (a.kit) { const st = a.kit[1]; let x = a.kit[0]; if (st === 'jump') x += Math.sin(T * 1.5) * 20; cat(c, x, 266, .8, { st, bow: true }, T); if (st === 'meow') { c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 3; for (let k = 0; k < 3; k++) { const r = 12 + ((T * 30 + k * 12) % 36); c.globalAlpha = 1 - r / 48; c.beginPath(); c.arc(x + 20, 228, r, -1, .2); c.stroke(); } c.globalAlpha = 1; bubbleText(c, x + 70, 180, plainShow('مِيَاو!', 'Meow!'), '#E5762B'); } }
      if (a.bfly) butterfly(c, 250 + Math.sin(T * 1.2) * 60, 170 + Math.sin(T * 2.3) * 25, 1.1, T);
      if (a.bird === 'fly') { const bx = 200 + Math.sin(T * .8) * 120; bird(c, bx, 60 + Math.sin(T * 2) * 10, 1.3, T, true); }
      if (a.bird === 'sit') bird(c, 340, 110, 1.1, T, false);
      if (a.hearts) hearts(c, T);
    },
    ice(c, T, a) {
      c.fillStyle = grad(c, 0, 0, 0, 180, ['#8FD3FF', '#D9F2FF']); c.fillRect(0, 0, 400, 180);
      if (a.sun) { const g = c.createRadialGradient(330, 50, 5, 330, 50, 70); g.addColorStop(0, 'rgba(255,240,150,.9)'); g.addColorStop(1, 'rgba(255,240,150,0)'); c.fillStyle = g; c.beginPath(); c.arc(330, 50, 70, 0, TAU); c.fill(); c.fillStyle = '#FFE15C'; c.beginPath(); c.arc(330, 50, 24, 0, TAU); c.fill(); }
      puff(c, 70, 50, 16); puff(c, 260, 34, 12);
      // جبال جليد
      c.fillStyle = '#E8F6FF'; c.beginPath(); c.moveTo(0, 170); c.lineTo(60, 100); c.lineTo(110, 150); c.lineTo(170, 90); c.lineTo(240, 170); c.fill();
      c.fillStyle = '#C6E6F8'; c.beginPath(); c.moveTo(170, 90); c.lineTo(200, 130); c.lineTo(240, 170); c.lineTo(170, 170); c.fill();
      // البحر
      c.fillStyle = grad(c, 0, 170, 0, 220, ['#4DB2E8', '#2E86D6']); c.fillRect(0, 168, 400, 60);
      c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { const x = (i * 80 + T * 20) % 440 - 20; c.beginPath(); c.moveTo(x, 190 + (i % 2) * 14); c.quadraticCurveTo(x + 10, 186 + (i % 2) * 14, x + 20, 190 + (i % 2) * 14); c.stroke(); }
      // الجليد
      c.fillStyle = grad(c, 0, 205, 0, 300, ['#FFFFFF', '#DCEFFB']); c.beginPath(); c.moveTo(0, 215); c.quadraticCurveTo(200, 196, 400, 212); c.lineTo(400, 300); c.lineTo(0, 300); c.fill();
      c.fillStyle = 'rgba(160,200,230,.5)'; c.beginPath(); c.moveTo(0, 215); c.quadraticCurveTo(200, 196, 400, 212); c.lineTo(400, 220); c.quadraticCurveTo(200, 204, 0, 223); c.fill();
      // كوخ ثلجي
      c.fillStyle = grad(c, 0, 150, 0, 215, ['#FFFFFF', '#D6EAF7']); c.beginPath(); c.arc(355, 214, 38, Math.PI, TAU); c.fill(); c.strokeStyle = 'rgba(150,190,220,.6)'; c.lineWidth = 1.5; for (let k = 1; k < 3; k++) { c.beginPath(); c.arc(355, 214, 38, Math.PI + k * .1, TAU - k * .1); c.stroke(); } c.fillStyle = '#6FA8CF'; c.beginPath(); c.arc(355, 214, 12, Math.PI, TAU); c.fill();
      sparkles(c, T, 8, [10, 230, 380, 60], '255,255,255');
      if (a.snowman) { const x = 210, y = 262; shadowE(c, x, y, 26, 5); c.fillStyle = rgrad(c, x, y - 18, 22, ['#fff', '#fff', '#D6EAF7']); c.beginPath(); c.arc(x, y - 18, 20, 0, TAU); c.fill(); c.beginPath(); c.arc(x, y - 48, 14, 0, TAU); c.fill(); eyes(c, x, y - 51, 5, 1.8, 'happy', T); c.fillStyle = '#FF8A2E'; c.beginPath(); c.moveTo(x, y - 47); c.lineTo(x + 10, y - 45); c.lineTo(x, y - 43); c.fill(); c.fillStyle = '#E2463F'; rr(c, x - 15, y - 37, 30, 6, 3); c.fill(); rr(c, x + 6, y - 34, 6, 14, 3); c.fill(); c.fillStyle = '#2A2A3A'; for (const k of [-6, 4]) { c.beginPath(); c.arc(x, y - 22 + k * 2, 2, 0, TAU); c.fill(); } }
      if (a.friends) { penguin(c, 290, 266, .75, { st: 'happy', scarf: '#7BD653', ph: 1 }, T); penguin(c, 340, 262, .7, { st: 'happy', scarf: '#FFC531', ph: 2 }, T); penguin(c, 80, 262, .7, { st: 'happy', scarf: '#B26BFF', ph: 3 }, T); for (let k = 0; k < 4; k++) fish(c, 160 + k * 26, 278, .7, ['#FFB347', '#5CC8FF', '#FF8BC2', '#7BD653'][k], 0); }
      if (a.bobo) { const st = a.bobo[1]; let y = 266, x = a.bobo[0];
        if (st === 'dive') { y = 200 - Math.abs(Math.sin(T * 1.6)) * 40; c.fillStyle = 'rgba(255,255,255,.8)'; for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(x - 20 + k * 8, 206 - Math.abs(Math.sin(T * 3 + k)) * 10, 3, 0, TAU); c.fill(); } }
        penguin(c, x, y, 1, { st: st === 'dive' || st === 'hold' ? 'happy' : st, scarf: '#3FB3F2', fish: st === 'hold' }, T);
        if ((st === 'dive' || st === 'hold') && a.fish) for (let k = 0; k < a.fish; k++) fish(c, x - 34 + k * 4, y - 40 + k * 12, .8, ['#FFB347', '#5CC8FF', '#FF8BC2'][k], -.3 + k * .2);
        if (a.give) fish(c, x + 36 + Math.sin(T * 2) * 4, y - 34, 1, '#FFB347', 0);
      }
      if (a.lulu) penguin(c, a.lulu[0], 266, .9, { st: a.lulu[1] === 'hold' ? 'happy' : a.lulu[1], scarf: '#FF6FA5', bow: true, fish: a.lulu[1] === 'hold', ph: 1.5 }, T);
      if (a.hearts) hearts(c, T, 4);
    },
    water(c, T) {
      c.fillStyle = grad(c, 0, 0, 0, 300, ['#6FD0F5', '#2E86D6', '#1A4F9A']); c.fillRect(0, 0, 400, 300);
      for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(255,255,255,.08)'; c.beginPath(); c.moveTo(40 + i * 70, 0); c.lineTo(70 + i * 70, 0); c.lineTo(20 + i * 70 + Math.sin(T + i) * 10, 300); c.lineTo(i * 70, 300); c.fill(); }
      c.fillStyle = '#2C9E7A'; for (let i = 0; i < 7; i++) { const x = 20 + i * 60; c.beginPath(); c.moveTo(x, 300); c.quadraticCurveTo(x + Math.sin(T * 1.5 + i) * 12, 250, x + 4, 220 + (i % 3) * 14); c.quadraticCurveTo(x + 12, 260, x + 10, 300); c.fill(); }
      c.fillStyle = '#F5D7A0'; c.beginPath(); c.moveTo(0, 300); c.quadraticCurveTo(200, 270, 400, 300); c.fill();
      for (let k = 0; k < 5; k++) fish(c, (T * 30 * (k % 2 ? 1 : -1) + k * 90 + 800) % 440 - 20, 60 + k * 45, .8, ['#FFB347', '#FF8BC2', '#7BD653', '#FFE15C', '#B26BFF'][k], k % 2 ? 0 : Math.PI);
      for (let i = 0; i < 12; i++) { const k = (T * .3 + i / 12) % 1; c.strokeStyle = `rgba(255,255,255,${.7 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.arc(60 + (i * 31) % 300 + Math.sin(T * 2 + i) * 6, 300 - k * 300, 3 + i % 3, 0, TAU); c.stroke(); }
      penguin(c, 170 + Math.sin(T) * 20, 170 + Math.sin(T * 1.3) * 10, 1, { st: 'happy', scarf: '#3FB3F2' }, T);
      penguin(c, 250 + Math.sin(T + 1) * 20, 200 + Math.sin(T * 1.2 + 1) * 10, .9, { st: 'happy', scarf: '#FF6FA5', bow: true, ph: 1.5 }, T);
    },
    nile(c, T, a) {
      const hot = a.hot;
      c.fillStyle = grad(c, 0, 0, 0, 170, hot ? ['#FFB86B', '#FFE7A8'] : ['#7EC8F5', '#DFF3FF']); c.fillRect(0, 0, 400, 170);
      const sx = 320, sy = 50, g = c.createRadialGradient(sx, sy, 5, sx, sy, 80); g.addColorStop(0, 'rgba(255,240,150,.9)'); g.addColorStop(1, 'rgba(255,240,150,0)'); c.fillStyle = g; c.beginPath(); c.arc(sx, sy, 80, 0, TAU); c.fill();
      c.fillStyle = hot ? '#FF8A3C' : '#FFE15C'; c.beginPath(); c.arc(sx, sy, 26, 0, TAU); c.fill();
      if (hot) { c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; for (let i = 0; i < 4; i++) { c.beginPath(); for (let x = 0; x < 400; x += 10) c.lineTo(x, 140 + i * 8 + Math.sin(x * .05 + T * 3 + i) * 3); c.stroke(); } }
      else { puff(c, 80, 50, 14); puff(c, 210, 36, 10); }
      // الضفة البعيدة والنيل
      c.fillStyle = '#E8C98C'; c.fillRect(0, 150, 400, 25);
      for (const x of [30, 60, 370]) { c.fillStyle = '#5E9E52'; c.beginPath(); c.ellipse(x, 150, 14, 8, 0, Math.PI, TAU); c.fill(); }
      c.fillStyle = grad(c, 0, 170, 0, 215, ['#4DB2E8', '#2B7FC4']); c.beginPath(); c.moveTo(0, 170); c.lineTo(400, 165); c.lineTo(400, 212); c.quadraticCurveTo(200, 222, 0, 210); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { const x = (i * 75 + T * 15) % 440 - 20; c.beginPath(); c.moveTo(x, 182 + (i % 3) * 9); c.lineTo(x + 18, 182 + (i % 3) * 9); c.stroke(); }
      // فلوكة
      const fx = (T * 8) % 480 - 40; c.fillStyle = '#8A5A2E'; c.beginPath(); c.moveTo(fx - 16, 180); c.lineTo(fx + 16, 180); c.lineTo(fx + 10, 187); c.lineTo(fx - 10, 187); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(fx, 179); c.lineTo(fx + 2, 150); c.lineTo(fx + 18, 176); c.fill();
      // الرمل
      c.fillStyle = grad(c, 0, 205, 0, 300, ['#F4D9A2', '#E2BC7A']); c.beginPath(); c.moveTo(0, 210); c.quadraticCurveTo(200, 222, 400, 212); c.lineTo(400, 300); c.lineTo(0, 300); c.fill();
      if (a.canal) { const k = a.canal; c.fillStyle = '#C79A5C'; c.beginPath(); c.moveTo(70, 214); c.quadraticCurveTo(80, 250, 300, 262); c.lineTo(300, 272); c.quadraticCurveTo(70, 262, 56, 214); c.fill(); c.save(); c.beginPath(); c.rect(0, 0, 60 + 260 * k, 300); c.clip(); c.fillStyle = '#4DB2E8'; c.beginPath(); c.moveTo(66, 214); c.quadraticCurveTo(78, 252, 300, 264); c.lineTo(300, 269); c.quadraticCurveTo(70, 258, 60, 214); c.fill(); c.restore(); }
      if (a.flowers) for (let i = 0; i < 9; i++) emo(c, ['🌷', '🌼', '🌸'][i % 3], 30 + i * 40, 284 - (i % 2) * 8, 18);
      palmTree(c, 310, 266, 1, a.palm || 0, T, a.dates);
      if (a.camel) { let x = a.camel[0]; if (a.camel[1] === 'walk') x += Math.sin(T * .5) * 30; camel(c, x, 270, .95, { st: a.camel[1] }, T); }
      if (a.dates && a.camel) { for (let k = 0; k < 3; k++) { c.fillStyle = '#7A3414'; c.beginPath(); c.ellipse(240 + k * 10, 272, 4, 5.5, 0, 0, TAU); c.fill(); } }
      if (a.hearts) hearts(c, T, 4);
    },
    sky(c, T, a) {
      c.fillStyle = grad(c, 0, 0, 0, 300, a.rain && !a.rainbow ? ['#9DB7D8', '#D6E6F5'] : ['#7EC8F5', '#E4F6FF']); c.fillRect(0, 0, 400, 300);
      const sea = a.sea, desert = a.desert;
      // الأرض
      if (sea) { c.fillStyle = grad(c, 0, 210, 0, 300, ['#4DB2E8', '#1F6FB8']); c.fillRect(0, 210, 400, 90); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 2; for (let i = 0; i < 8; i++) { const x = (i * 60 + T * 20) % 440 - 20; c.beginPath(); c.moveTo(x, 230 + (i % 3) * 20); c.quadraticCurveTo(x + 10, 225 + (i % 3) * 20, x + 20, 230 + (i % 3) * 20); c.stroke(); }
        if (a.grow) for (let i = 0; i < 8; i++) { const k = (T * .4 + i / 8) % 1; c.fillStyle = `rgba(255,255,255,${.6 * Math.sin(k * Math.PI)})`; c.beginPath(); c.arc(140 + i * 18, 220 - k * 110, 3, 0, TAU); c.fill(); } }
      else if (desert) { c.fillStyle = grad(c, 0, 200, 0, 300, ['#F4D9A2', '#E2BC7A']); c.beginPath(); c.moveTo(0, 220); c.quadraticCurveTo(120, 190, 240, 215); c.quadraticCurveTo(320, 200, 400, 210); c.lineTo(400, 300); c.lineTo(0, 300); c.fill(); emo(c, '🌵', 60, 236, 34); emo(c, '🌵', 345, 230, 26); }
      else { c.fillStyle = grad(c, 0, 200, 0, 300, a.field ? ['#9BE26A', '#58B83A'] : ['#B9E58E', '#7CC659']); c.beginPath(); c.moveTo(0, 220); c.quadraticCurveTo(100, 196, 200, 214); c.quadraticCurveTo(300, 230, 400, 206); c.lineTo(400, 300); c.lineTo(0, 300); c.fill();
        if (a.field) for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) emo(c, ['🌾', '🌱', '🌿'][r], 20 + i * 45 + r * 12, 240 + r * 22, 18); }
      if (a.rainbow) { c.save(); c.globalAlpha = .75; ['#FF5C5C', '#FFA53C', '#FFE15C', '#6FD66B', '#4DB2E8', '#9B6BFF'].forEach((col, i) => { c.strokeStyle = col; c.lineWidth = 7; c.beginPath(); c.arc(200, 260, 170 - i * 7, Math.PI, TAU); c.stroke(); }); c.restore(); }
      if (a.big) { puff(c, 70, 80, 26, '#C7D3E6', 'rgba(90,100,130,.5)'); puff(c, 330, 70, 30, '#C7D3E6', 'rgba(90,100,130,.5)'); for (let i = 0; i < 14; i++) { const k = (T * 1.2 + i / 14) % 1; c.strokeStyle = 'rgba(80,140,220,.7)'; c.lineWidth = 2; const x = (i < 7 ? 45 : 300) + (i % 7) * 9; c.beginPath(); c.moveTo(x, 100 + k * 110); c.lineTo(x - 2, 108 + k * 110); c.stroke(); } }
      else { puff(c, 60, 50, 12); puff(c, 340, 40, 14); }
      if (a.gather) for (let i = 0; i < 4; i++) { const k = Math.min(1, (T % 6) / 3), ang = i / 4 * TAU; const x = lerp(200 + Math.cos(ang) * 170, 200 + Math.cos(ang) * 50, k), y = lerp(85 + Math.sin(ang) * 60, 85 + Math.sin(ang) * 20, k); cloudChar(c, x, y, .45, { mood: 'happy', grey: .5 }, T + i); }
      if (a.cl) { const [x, y, sz, mood] = a.cl, grow = a.grow ? 1 + ((T * .1) % .3) : 1; cloudChar(c, x, y, sz * grow, { mood, grey: sz > 1.2 ? .55 : 0 }, T); }
      if (a.drops) for (let i = 0; i < 2; i++) { const k = (T * .5 + i * .5) % 1; c.fillStyle = 'rgba(80,160,240,.9)'; const x = 190 + i * 20, y = 120 + k * 100; c.beginPath(); c.moveTo(x, y - 7); c.quadraticCurveTo(x + 4, y, x, y + 3); c.quadraticCurveTo(x - 4, y, x, y - 7); c.fill(); }
      if (a.rain) for (let i = 0; i < 40; i++) { const k = (T * 1.3 + (i * 37 % 100) / 100) % 1; const x = (a.cl ? a.cl[0] : 200) - 70 + (i * 29) % 140, y = 110 + k * 160; c.fillStyle = 'rgba(80,160,240,.8)'; c.beginPath(); c.moveTo(x, y - 6); c.quadraticCurveTo(x + 3, y, x, y + 2); c.quadraticCurveTo(x - 3, y, x, y - 6); c.fill(); }
      if (a.wind) wind(c, 90, 100, 1.2, T);
      if (a.tree) { const x = 200, y = 268; shadowE(c, x, y, 40, 6); c.fillStyle = '#8A5A2E'; rr(c, x - 7, y - 50, 14, 50, 5); c.fill(); for (const [dx, dy, r] of [[0, -78, 34], [-28, -62, 24], [28, -62, 24]]) { c.fillStyle = rgrad(c, x + dx, y + dy, r, ['#8EE06A', '#4DAA3A', '#2E7A2A']); c.beginPath(); c.arc(x + dx, y + dy, r, 0, TAU); c.fill(); } for (let i = 0; i < 9; i++) { const ang = i * 2.4, rr2 = 10 + (i * 7) % 24, bl = Math.min(1, (T % 8) / 3); c.fillStyle = '#FFB3D1'; c.beginPath(); c.arc(x + Math.cos(ang) * rr2, y - 74 + Math.sin(ang) * rr2 * .8, 4.5 * bl, 0, TAU); c.fill(); } }
      if (desert) { const bl = Math.min(1, (T % 8) / 3), x = 200, y = 262; c.strokeStyle = '#4DAA3A'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 26 * bl); c.stroke(); c.fillStyle = '#4DAA3A'; c.beginPath(); c.ellipse(x - 8, y - 10, 7, 3, .4, 0, TAU); c.fill(); for (let k = 0; k < 6; k++) { const ang = k / 6 * TAU + T * .3; c.fillStyle = '#FF7AB0'; c.beginPath(); c.ellipse(x + Math.cos(ang) * 7 * bl, y - 30 * bl + Math.sin(ang) * 7 * bl, 6 * bl, 4 * bl, ang, 0, TAU); c.fill(); } c.fillStyle = '#FFE15C'; c.beginPath(); c.arc(x, y - 30 * bl, 4 * bl, 0, TAU); c.fill(); if (bl > .9) { eyes(c, x, y - 31, 2, .9, 'happy', T); } }
    },
    night(c, T, a) {
      c.fillStyle = grad(c, 0, 0, 0, 220, ['#0B1230', '#1E2A6A', '#34408A']); c.fillRect(0, 0, 400, 220);
      sparkles(c, T, a.stars ? 30 : 10, [0, 0, 400, 180]);
      if (a.moon || a.clouds) { const mx = 330, my = 50; c.save(); c.shadowColor = '#FFF3B0'; c.shadowBlur = a.moon ? 30 : 6; c.fillStyle = '#FFF1B8'; c.beginPath(); c.arc(mx, my, 22, 0, TAU); c.fill(); c.restore(); }
      if (a.clouds) { const k = a.clouds; c.globalAlpha = .95; for (const [x, y, s2] of [[320, 55, 26], [250, 40, 20], [100, 50, 24], [170, 70, 18]]) puff(c, x + (1 - k) * 200 * (x > 200 ? 1 : -1), y, s2, '#4A5590', 'rgba(20,25,60,.5)'); c.globalAlpha = 1; }
      if (a.wind) wind(c, 230, 60, 1, T);
      // البحر
      c.fillStyle = grad(c, 0, 210, 0, 300, ['#1B3B78', '#0E1F48']); c.fillRect(0, 205, 400, 95);
      const lightK = a.star ? clamp(a.star[2], 0, 1.2) : 0;
      c.strokeStyle = `rgba(255,240,170,${.15 + lightK * .4})`; c.lineWidth = 2; for (let i = 0; i < 10; i++) { const x = (i * 47 + T * 14) % 440 - 20; c.beginPath(); c.moveTo(x, 222 + (i % 4) * 18); c.quadraticCurveTo(x + 10, 218 + (i % 4) * 18, x + 22, 222 + (i % 4) * 18); c.stroke(); }
      if (a.shore) { c.fillStyle = '#2A2F55'; c.beginPath(); c.moveTo(300, 210); c.quadraticCurveTo(350, 196, 400, 198); c.lineTo(400, 300); c.lineTo(330, 300); c.fill(); for (const [x, y] of [[345, 180], [375, 172]]) { c.fillStyle = '#3B4170'; rr(c, x - 12, y, 24, 22, 2); c.fill(); c.beginPath(); c.moveTo(x - 15, y); c.lineTo(x, y - 12); c.lineTo(x + 15, y); c.fill(); c.fillStyle = `rgba(255,214,110,${.8 + .2 * Math.sin(T * 3 + x)})`; c.fillRect(x - 5, y + 6, 10, 8); } }
      if (a.boat) { const [bx, bst] = a.boat; boat(c, bx + (bst === 'lost' ? Math.sin(T * .6) * 20 : 0), 230, 1, T, true); if (bst === 'lost') emo(c, '❔', bx + 10, 150 + Math.sin(T * 2) * 4, 18); }
      if (a.star) { const [x, y, glow, mood] = a.star; starChar(c, x, y, 1, { glow, mood }, T); if (glow > 1 && a.boat) { c.save(); c.globalAlpha = .18 + .06 * Math.sin(T * 4); c.fillStyle = '#FFF0AA'; c.beginPath(); c.moveTo(x - 10, y + 10); c.lineTo(a.boat[0] - 50, 240); c.lineTo(a.boat[0] + 50, 240); c.lineTo(x + 10, y + 10); c.fill(); c.restore(); } }
      if (a.hearts) hearts(c, T, 4);
    },
    park(c, T, a) {
      c.fillStyle = grad(c, 0, 0, 0, 200, ['#8FD3FF', '#E1F5FF']); c.fillRect(0, 0, 400, 200);
      const g = c.createRadialGradient(60, 40, 5, 60, 40, 60); g.addColorStop(0, 'rgba(255,240,150,.9)'); g.addColorStop(1, 'rgba(255,240,150,0)'); c.fillStyle = g; c.beginPath(); c.arc(60, 40, 60, 0, TAU); c.fill(); c.fillStyle = '#FFE15C'; c.beginPath(); c.arc(60, 40, 20, 0, TAU); c.fill();
      puff(c, 220, 50, 14); puff(c, 340, 70, 11);
      // تلال وأشجار
      c.fillStyle = '#A8E07A'; c.beginPath(); c.ellipse(80, 200, 160, 50, 0, Math.PI, TAU); c.ellipse(320, 205, 180, 55, 0, Math.PI, TAU); c.fill();
      for (const [x, s2] of [[30, 1], [370, 1.1]]) { c.fillStyle = '#8A5A2E'; rr(c, x - 5 * s2, 160, 10 * s2, 50, 4); c.fill(); c.fillStyle = rgrad(c, x, 150, 30 * s2, ['#8EE06A', '#4DAA3A', '#2E7A2A']); c.beginPath(); c.arc(x, 145, 30 * s2, 0, TAU); c.fill(); }
      c.fillStyle = grad(c, 0, 200, 0, 300, ['#8FDB62', '#5CB83E']); c.fillRect(0, 200, 400, 100);
      c.fillStyle = '#EAD6A8'; c.beginPath(); c.moveTo(0, 262); c.quadraticCurveTo(200, 240, 400, 258); c.lineTo(400, 300); c.lineTo(0, 300); c.fill();
      for (let i = 0; i < 6; i++) emo(c, ['🌼', '🌷'][i % 2], 20 + i * 70, 232 + (i % 2) * 6, 14);
      // العصافير
      for (let i = 0; i < 2; i++) { const x = (T * 25 + i * 200) % 460 - 30; c.strokeStyle = '#3A4A6A'; c.lineWidth = 2; const f = Math.sin(T * 10 + i) * 4; c.beginPath(); c.moveTo(x - 8, 70 + i * 20 + f); c.quadraticCurveTo(x - 4, 66 + i * 20, x, 70 + i * 20); c.quadraticCurveTo(x + 4, 66 + i * 20, x + 8, 70 + i * 20 + f); c.stroke(); }
      if (a.office) { const x = 320, y = 250; c.save(); c.shadowColor = 'rgba(0,0,0,.2)'; c.shadowBlur = 8; c.fillStyle = grad(c, 0, y - 90, 0, y, ['#FFF4E0', '#F2D9AE']); rr(c, x - 42, y - 86, 84, 86, 8); c.fill(); c.restore(); c.fillStyle = '#E2463F'; c.beginPath(); c.moveTo(x - 52, y - 84); c.lineTo(x, y - 112); c.lineTo(x + 52, y - 84); c.closePath(); c.fill(); c.fillStyle = '#9CC9F0'; rr(c, x - 30, y - 70, 60, 30, 5); c.fill(); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(x - 26, y - 66, 10, 22); c.fillStyle = '#3D7FD6'; rr(c, x - 30, y - 104 + 22, 60, 0, 3); c.fill(); c.fillStyle = '#B9874F'; rr(c, x - 46, y - 40, 92, 8, 3); c.fill(); emo(c, 'ℹ️', x, y - 55, 18); }
      // المقعد
      const bx = 230, by = 258;
      c.fillStyle = '#5A3A24'; c.fillRect(bx - 40, by - 18, 5, 18); c.fillRect(bx + 35, by - 18, 5, 18);
      c.fillStyle = grad(c, 0, by - 46, 0, by - 18, ['#D99A5A', '#B07436']); rr(c, bx - 46, by - 26, 92, 8, 3); c.fill(); rr(c, bx - 46, by - 46, 92, 7, 3); c.fill(); rr(c, bx - 46, by - 36, 92, 7, 3); c.fill();
      if (a.ball) { let x = 120, y = 262 - 9; if (a.ball === 'bounce') { x = 110 + Math.sin(T * 1.4) * 40; y = 262 - 9 - Math.abs(Math.sin(T * 4)) * 40; } else if (a.ball === 'bench') { x = 248; y = 256; } shadowE(c, x, 263, 9, 2.5); c.fillStyle = rgrad(c, x, y, 10, ['#FFE08A', '#FF9F2E', '#E0621B']); c.beginPath(); c.arc(x, y, 9.5, 0, TAU); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 9.5, -1, 1); c.stroke(); }
      if (a.wallet === 'ground') { wallet(c, 212, 258, 1, false); c.globalAlpha = .6 + .4 * Math.sin(T * 5); IKspark(c, 222, 246, 6); c.globalAlpha = 1; }
      if (a.elder) elder(c, a.elder[0], 268, 1, { g: a.elder[1], st: a.elder[2] }, T);
      if (a.kid) {
        let x = a.kid[0]; if (a.kid[1] === 'walk') x += Math.sin(T * .7) * 14;
        const hands = kid(c, x, 268, 1, { st: a.kid[1] }, T);
        const h = hands[1];
        if (a.wallet === 'open') wallet(c, (hands[0][0] + h[0]) / 2, h[1] - 2, 1.2, true);
        if (a.wallet === 'hand' || a.wallet === 'give') wallet(c, h[0] + 6, h[1] - 2, 1, false);
        if (a.kid[1] === 'rose') emo(c, '🌹', h[0] + 4, h[1] - 10, 22);
      }
      if (a.hearts) hearts(c, T, 4);
    }
  };
  function IKspark(c, x, y, r) { c.fillStyle = '#fff'; c.beginPath(); for (let i = 0; i < 4; i++) { const an = i * Math.PI / 2; c.quadraticCurveTo(x + Math.cos(an + Math.PI / 4) * r * .2, y + Math.sin(an + Math.PI / 4) * r * .2, x + Math.cos(an + Math.PI / 2) * r, y + Math.sin(an + Math.PI / 2) * r); } c.fill(); }
  const plainShow = (ar, en) => lang === 'en' ? en : plain(ar);
  function bubbleText(c, x, y, txt, col, size = 15) {
    c.save(); c.font = `900 ${size}px ${lang === 'en' ? EN_FONT : FONT}`;
    const w = c.measureText(txt).width + 22, h = size * 1.8;
    c.shadowColor = 'rgba(0,0,0,.15)'; c.shadowBlur = 6; c.shadowOffsetY = 2;
    c.fillStyle = '#fff'; rr(c, x - w / 2, y - h / 2, w, h, h / 2); c.fill(); c.shadowColor = 'transparent';
    c.beginPath(); c.moveTo(x - 14, y + h / 2 - 2); c.lineTo(x - 24, y + h / 2 + 10); c.lineTo(x - 4, y + h / 2 - 2); c.fill();
    c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x, y + 1); c.restore();
  }
  function drawScene(c, W, H, page, t) {
    const s = Math.max(W / 400, H / 300);
    c.save(); c.translate((W - 400 * s) / 2, (H - 300 * s) / 2); c.scale(s, s);
    try { SCENES[page.sc](c, t, page.a || {}); } catch (e) { console.warn(e); }
    c.restore();
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #stories{background:linear-gradient(#FFF1DD,#FFE3EC);overflow:hidden;color:#4A2E3A}
  #stories::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 15% 15%,rgba(255,255,255,.85),transparent 40%),radial-gradient(circle at 85% 85%,rgba(255,200,220,.4),transparent 45%);pointer-events:none}
  #stories .ib{color:#C2477A}
  #stories .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(150,60,90,.16),0 8px 16px rgba(150,60,90,.12)}
  #stories .lang button{min-width:64px;padding:6px 12px;border-radius:99px;font-weight:900;font-size:17px;background:#FFF0F5;color:#B24273;line-height:1.25}
  #stories .lang button[data-l=en]{font-family:${EN_FONT};font-size:16px}
  #stories .lang button.on{background:linear-gradient(#FF7FB0,#E2457F);color:#fff;box-shadow:0 3px 0 #B02E62}
  #stories .hidden{display:none!important}
  #stories .scr{position:absolute;left:0;right:0;bottom:0;top:calc(max(10px,env(safe-area-inset-top)) + 62px);overflow-y:auto;touch-action:pan-y;padding:4px 14px max(16px,env(safe-area-inset-bottom))}
  #stories .lib h2{margin:2px 0 4px;text-align:center;font-size:26px;font-weight:900;color:#C2477A;text-shadow:0 3px 0 #FFE0EC}
  #stories .lib .sub{text-align:center;font-weight:800;color:#9A6A7E;font-size:15px;margin-bottom:12px}
  #stories .shelf{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;max-width:900px;margin:0 auto}
  @media (min-width:700px){#stories .shelf{grid-template-columns:repeat(3,1fr)}}
  #stories .cover{position:relative;border-radius:22px;background:#fff;padding:6px;border:4px solid var(--c1);box-shadow:0 6px 0 var(--c2),0 12px 20px rgba(120,40,70,.18);text-align:center;color:#4A2E3A;transform-origin:50% 100%}
  #stories .cover:active{transform:translateY(4px);box-shadow:0 2px 0 var(--c2)}
  #stories .cover canvas{width:100%;aspect-ratio:4/3;display:block;border-radius:16px}
  #stories .cover .ct{position:absolute;left:10px;right:10px;top:calc(100% - 92px);background:rgba(255,255,255,.94);border-radius:14px;padding:3px 6px;font-weight:900;font-size:15px;line-height:1.3;box-shadow:0 3px 8px rgba(0,0,0,.12);border:2px solid var(--c1)}
  #stories .cover .ct.en{font-family:${EN_FONT};font-size:13px}
  #stories .cover .ce{display:flex;justify-content:center;gap:2px;margin-top:30px;font-size:16px;min-height:22px}
  #stories .cover .ce i{font-style:normal}#stories .cover .ce i.off{filter:grayscale(1);opacity:.28}
  #stories .cover .ic{position:absolute;top:-10px;right:-8px;width:40px;height:40px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:22px;font-family:${EMOJI_FONT};box-shadow:0 3px 0 var(--c2),0 4px 8px rgba(0,0,0,.12);border:3px solid var(--c1)}
  #stories .rd{display:flex;flex-direction:column;align-items:center;gap:10px;min-height:100%}
  #stories .rd>:first-child{margin-top:auto}#stories .rd>:last-child{margin-bottom:auto}
  #stories .prog{display:flex;gap:5px;padding:6px 10px;background:rgba(255,255,255,.92);border-radius:99px;box-shadow:0 3px 0 rgba(0,0,0,.06)}
  #stories .prog i{width:22px;height:11px;border-radius:6px;background:#F1E2E8;box-shadow:inset 0 2px 0 rgba(0,0,0,.07)}
  #stories .prog i.on{background:linear-gradient(#FFD36B,#F2A20F);box-shadow:0 2px 0 #C67F00}
  #stories .prog i.cur{background:linear-gradient(#FF9CC4,#E2457F);box-shadow:0 2px 0 #B02E62}
  #stories .book{width:min(100%,560px);perspective:1400px}
  #stories .page{position:relative;background:#fff;border-radius:28px;padding:8px;border:4px solid #FFD7E6;box-shadow:0 7px 0 #F2B0C8,0 14px 28px rgba(150,40,80,.16);transform-style:preserve-3d}
  #stories .page canvas{width:100%;aspect-ratio:4/3;display:block;border-radius:20px}
  #stories .page .pn{position:absolute;bottom:14px;left:14px;background:rgba(255,255,255,.9);border-radius:99px;padding:2px 10px;font-weight:900;font-size:13px;color:#B24273}
  #stories .txt{width:min(100%,560px);background:linear-gradient(#FFFFFF,#FFF9F2);border-radius:24px;border:4px solid #F6E3B4;box-shadow:0 6px 0 #EBCB82;padding:10px 14px;font-size:clamp(19px,5.2vw,24px);font-weight:800;line-height:1.75;color:#4A3B2A;text-align:right;direction:rtl}
  #stories .txt.en{direction:ltr;text-align:left;font-family:${EN_FONT};font-size:clamp(17px,4.6vw,21px);line-height:1.55}
  #stories .txt .s{display:inline;transition:opacity .3s}
  #stories .txt .s.dim{opacity:.45}
  #stories .txt span.w{border-radius:6px;transition:color .2s,background .2s;cursor:pointer}
  #stories .txt span.w.on{color:#D2336F;background:rgba(255,200,225,.45)}
  #stories .moral{width:min(100%,560px);display:flex;gap:10px;align-items:center;background:linear-gradient(#FFF6C8,#FFE58A);border:4px solid #fff;border-radius:22px;box-shadow:0 5px 0 #E6B53C,0 10px 18px rgba(200,140,20,.25);padding:8px 14px;font-weight:900;color:#7A4A00;font-size:clamp(17px,4.6vw,21px);line-height:1.5}
  #stories .moral.en{direction:ltr;font-family:${EN_FONT};font-size:17px}
  #stories .moral .mi{font-size:30px;font-family:${EMOJI_FONT};flex:none}
  #stories .moral small{display:block;font-size:13px;opacity:.75}
  #stories .chs{width:min(100%,560px);display:grid;grid-template-columns:1fr 1fr;gap:10px}
  #stories .chb{display:flex;flex-direction:column;align-items:center;gap:2px;background:#fff;border-radius:22px;border:4px solid #CDEBFF;box-shadow:0 6px 0 #9FD0F2;padding:10px 6px;font-weight:900;font-size:clamp(16px,4.4vw,19px);color:#1E5A86;line-height:1.3}
  #stories .chb.en{font-family:${EN_FONT};font-size:15px}
  #stories .chb .e{font-size:36px;font-family:${EMOJI_FONT};line-height:1.15}
  #stories .chb:active{transform:translateY(4px);box-shadow:0 2px 0 #9FD0F2}
  #stories .chb.say{border-color:#FFB3D1;box-shadow:0 6px 0 #F28DB6,0 0 0 6px rgba(255,150,200,.25)}
  #stories .nav{width:min(100%,560px);display:flex;gap:10px;justify-content:center;align-items:center}
  #stories .nb{height:52px;border-radius:26px;font-size:18px;font-weight:900;padding:0 18px;background:#fff;color:#C2477A;box-shadow:0 4px 0 #F2C4D6;border:3px solid #FFE3EE;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}
  #stories .nb:active{transform:translateY(3px);box-shadow:0 1px 0 #F2C4D6}
  #stories .nb.go{background:linear-gradient(#FF7FB0,#E2457F);color:#fff;box-shadow:0 4px 0 #B02E62;border-color:#FFC2DA;flex:1;max-width:260px}
  #stories .nb.go.glow{animation:stGlow .9s ease-in-out infinite alternate}
  @keyframes stGlow{to{transform:scale(1.04);box-shadow:0 4px 0 #B02E62,0 0 22px rgba(255,100,160,.7)}}
  #stories .nb.sq{width:52px;padding:0;font-size:22px}
  #stories .ib.snd.nb{width:52px;height:52px;flex:0 0 52px;padding:0}
  #stories .endb{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;width:min(100%,560px)}
  #stories .endb .nb{flex:1;min-width:150px}
  #stories .badge{background:linear-gradient(#FFE08A,#F6B92B);color:#6B4300;border-radius:99px;padding:4px 14px;font-weight:900;box-shadow:0 3px 0 #C98A0B}
  #stories .badge.old{background:#fff;color:#9A6A7E;box-shadow:0 3px 0 #F2C4D6}
  @media (orientation:landscape) and (min-width:700px) and (max-height:820px){
    #stories .rd{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);grid-auto-rows:min-content;column-gap:24px;row-gap:10px;align-content:center;justify-items:center;max-width:1100px;margin:0 auto}
    #stories .rd>*{grid-column:2;margin:0!important}
    #stories .rd>.book{grid-column:1;grid-row:1 / span 6;align-self:center;width:min(100%,calc((100vh - 120px) * 1.33))}
  }
  `);
  const root = App.section(ID, `
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib libb hidden" aria-label="المكتبة">📚</button>
      <span class="grow"></span>
      <div class="lang"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="scr lib"><h2>📚 مكتبة القصص</h2><div class="sub"></div><div class="shelf"></div></div>
    <div class="scr reader hidden"><div class="rd">
      <div class="prog"></div>
      <div class="book"><div class="page"><canvas></canvas><span class="pn"></span></div></div>
      <div class="txt"></div>
      <div class="moral hidden"><span class="mi">🌟</span><span class="mt"></span></div>
      <div class="chs hidden"></div>
      <div class="endb hidden"></div>
      <div class="nav">
        <button class="nb sq prev" aria-label="السابق">▶</button>
        <button class="ib snd nb play" aria-label="اسمع">🔊</button>
        <button class="nb go">التالي ◀</button>
      </div>
    </div></div>`);
  const libEl = root.querySelector('.lib'), shelf = root.querySelector('.shelf'), readerEl = root.querySelector('.reader');
  const pageEl = root.querySelector('.page'), cv = pageEl.querySelector('canvas'), pnEl = pageEl.querySelector('.pn');
  const txtEl = root.querySelector('.txt'), moralEl = root.querySelector('.moral'), chsEl = root.querySelector('.chs'), endEl = root.querySelector('.endb');
  const goBtn = root.querySelector('.nb.go'), prevBtn = root.querySelector('.nb.prev'), progEl = root.querySelector('.prog'), libBtn = root.querySelector('.libb');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, raf = 0, last = 0, running = false, paused = false, T = 0, sceneT = 0;
  let view = 'lib', story = null, pid = null, hist = [], tasks = [], nar = null, turning = false;
  function later(s, fn) { tasks.push({ t: s, fn }); }
  function layout() { const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; }

  /* ---------- المكتبة ---------- */
  function renderLib() {
    view = 'lib'; stopNar();
    libEl.classList.remove('hidden'); readerEl.classList.add('hidden'); libBtn.classList.add('hidden');
    const F = found(), en = lang === 'en';
    const got = STORIES.reduce((a, s) => a + (F[s.id] || []).length, 0);
    root.querySelector('.lib h2').textContent = en ? '📚 Story Library' : '📚 مكتبة القصص';
    root.querySelector('.lib h2').style.fontFamily = en ? EN_FONT : '';
    root.querySelector('.lib .sub').textContent = `${App.g('اختاري', 'اختر')} قصة · ⭐ ${num(got)} / ${num(TOTAL_ENDS)} ${'نهايات'}`;
    shelf.innerHTML = STORIES.map(s => {
      const ends = endingsOf(s), f = F[s.id] || [];
      return `<button class="cover" data-s="${s.id}" style="--c1:${s.col[0]};--c2:${s.col[1]}"><canvas></canvas><span class="ic">${s.ic}</span>
        <div class="ct${en ? ' en' : ''}">${esc(en ? G(s.en) : G(s.ar))}</div>
        <div class="ce">${ends.map(e => `<i class="${f.includes(e) ? '' : 'off'}">⭐</i>`).join('')}</div></button>`;
    }).join('');
    shelf.querySelectorAll('.cover').forEach((b, i) => {
      const cvs = b.querySelector('canvas'); requestAnimationFrame(() => { const f = fitCanvas(cvs); const s = BY[b.dataset.s]; drawScene(f.ctx, f.w, f.h, s.pages[s.start], 1.2 + i); });
      if (window.gsap) gsap.from(b, { y: 30, scale: .9, opacity: 0, duration: .45, delay: .05 * i, ease: 'back.out(1.8)' });
      b.addEventListener('click', () => { Sound.tap(); openStory(b.dataset.s, b); });
    });
    lang === 'en' ? App.speak('Choose a story', 'en') : App.speak(App.g('اختاري قصة', 'اختر قصة'));
  }

  /* ---------- القارئ ---------- */
  function openStory(id, from) {
    story = BY[id]; hist = [];
    libEl.classList.add('hidden'); readerEl.classList.remove('hidden'); libBtn.classList.remove('hidden'); view = 'read';
    layout(); showPage(story.start, 0);
    if (window.gsap && from) gsap.from(pageEl, { scale: .6, opacity: 0, duration: .5, ease: 'back.out(1.6)' });
  }
  const maxDepth = s => { const d = (k, n) => { const p = s.pages[k]; if (p.end) return n; if (p.next) return d(p.next, n + 1); return Math.max(...p.ch.map(c => d(c.to, n + 1))); }; return d(s.start, 1); };
  function sentences(p) { return (lang === 'en' ? p.en : p.ar).map(G); }
  function showPage(k, dir) {
    stopNar(); tasks = [];
    const doIt = () => {
      pid = k; const p = story.pages[k], en = lang === 'en';
      if (hist[hist.length - 1] !== k) hist.push(k);
      sceneT = 0;
      txtEl.classList.toggle('en', en);
      txtEl.innerHTML = sentences(p).map((s, i) => `<span class="s" data-i="${i}">${s.split(' ').map(w => `<span class="w">${esc(w)}</span>`).join(' ')}</span>`).join(' ');
      txtEl.querySelectorAll('span.w').forEach(w => w.addEventListener('click', () => { const t = w.textContent; en ? App.speak(t, 'en') : App.speak(plain(t)); w.classList.add('on'); setTimeout(() => w.classList.remove('on'), 500); }));
      moralEl.classList.add('hidden'); chsEl.classList.add('hidden'); endEl.classList.add('hidden');
      goBtn.classList.remove('glow');
      goBtn.style.visibility = p.ch || p.end ? 'hidden' : '';
      prevBtn.style.visibility = hist.length > 1 ? '' : 'hidden';
      const depth = maxDepth(story);
      progEl.style.direction = en ? 'ltr' : 'rtl';
      progEl.innerHTML = Array.from({ length: depth }, (_, i) => `<i class="${i < hist.length - 1 ? 'on' : i === hist.length - 1 ? 'cur' : ''}"></i>`).join('');
      pnEl.textContent = `${num(hist.length)}`;
      narrate(p);
    };
    if (dir && window.gsap && !turning) {
      turning = true; Sound.whoosh();
      const sgn = (dir > 0 ? 1 : -1) * (lang === 'en' ? -1 : 1);
      gsap.timeline({ onComplete: () => { turning = false; } })
        .to(pageEl, { rotationY: 90 * sgn, transformOrigin: sgn > 0 ? '100% 50%' : '0% 50%', duration: .28, ease: 'power2.in' })
        .add(doIt)
        .fromTo(pageEl, { rotationY: -90 * sgn, transformOrigin: sgn > 0 ? '0% 50%' : '100% 50%' }, { rotationY: 0, duration: .38, ease: 'power2.out' })
        .fromTo(txtEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3 }, '-=.2');
    } else doIt();
  }
  /* النطق جملةً جملة مع تظليل الكلمات */
  function sDur(s) { const n = s.split(/\s+/).length; return lang === 'en' ? .5 + n * .36 : .6 + n * .55; }
  function stopNar() { nar = null; }
  function narrate(p) {
    const ss = sentences(p);
    nar = { p, i: -1, t: 0, d: 0, ss, wait: .5 };
    txtEl.querySelectorAll('.s').forEach(s => s.classList.add('dim'));
  }
  function speakingNow() { try { return window.speechSynthesis && speechSynthesis.speaking; } catch (e) { return false; } }
  function narStep(dt) {
    if (!nar) return;
    nar.t += dt;
    if (nar.wait > 0) { nar.wait -= dt; if (nar.wait <= 0) nextSentence(); return; }
    const sEl = txtEl.querySelector(`.s[data-i="${nar.i}"]`);
    if (sEl) { const ws = sEl.querySelectorAll('.w'), k = Math.min(ws.length, Math.floor(nar.t / nar.d * ws.length + .4)); ws.forEach((w, j) => w.classList.toggle('on', j < k && nar.t < nar.d + .3)); }
    if (nar.t > nar.d + .25 && (!speakingNow() || nar.t > nar.d + 4)) { if (sEl) sEl.querySelectorAll('.w').forEach(w => w.classList.remove('on')); nar.wait = .35; }
  }
  function nextSentence() {
    nar.i++;
    if (nar.i >= nar.ss.length) { const p = nar.p; nar = null; pageDone(p); return; }
    const s = nar.ss[nar.i];
    txtEl.querySelectorAll('.s').forEach(x => x.classList.toggle('dim', +x.dataset.i !== nar.i));
    nar.t = 0; nar.d = sDur(s);
    lang === 'en' ? App.speak(s, 'en') : App.speak(plain(s));
  }
  function pageDone(p) {
    txtEl.querySelectorAll('.s').forEach(x => x.classList.remove('dim'));
    const en = lang === 'en';
    if (p.ch) {
      chsEl.innerHTML = p.ch.map((c, i) => `<button class="chb${en ? ' en' : ''}" data-i="${i}"><span class="e">${c.ic}</span>${esc(en ? G(c.en) : G(c.ar))}</button>`).join('');
      chsEl.classList.remove('hidden');
      chsEl.querySelectorAll('.chb').forEach((b, i) => {
        if (window.gsap) gsap.from(b, { y: 20, scale: .8, opacity: 0, duration: .4, delay: i * .12, ease: 'back.out(2)' });
        b.addEventListener('click', () => choose(+b.dataset.i));
      });
      // قراءة الخيارين
      let t = .3;
      p.ch.forEach((c, i) => { const txt = en ? G(c.en) : plain(G(c.ar)); later(t, () => { chsEl.querySelectorAll('.chb').forEach((b, j) => b.classList.toggle('say', j === i)); en ? App.speak(txt, 'en') : App.speak(txt); }); t += sDur(txt) + .3; if (i === 0) { later(t, () => en ? App.speak('or', 'en') : App.speak('أم')); t += .7; } });
      later(t, () => chsEl.querySelectorAll('.chb').forEach(b => b.classList.remove('say')));
    } else if (p.end) {
      finishEnding(p);
    } else goBtn.classList.add('glow');
  }
  function choose(i) {
    if (turning) return;
    const p = story.pages[pid], c = p.ch[i]; tasks = [];
    Sound.pop(); vibrate(15);
    showPage(c.to, 1);
  }
  function finishEnding(p) {
    const en = lang === 'en';
    moralEl.classList.toggle('en', en);
    moralEl.querySelector('.mt').innerHTML = `<small>${en ? 'The lesson' : 'العِبْرَةُ'}</small>${esc(en ? p.men : p.mar)}`;
    moralEl.classList.remove('hidden');
    if (window.gsap) gsap.from(moralEl, { scale: .5, opacity: 0, duration: .5, ease: 'back.out(2)' });
    later(.4, () => en ? App.speak(p.men, 'en') : App.speak(plain(p.mar)));
    const F = found(), list = F[story.id] || [], isNew = !list.includes(pid);
    if (isNew) { list.push(pid); F[story.id] = list; store.set('storiesEnds', F); }
    const ends = endingsOf(story), got = ends.filter(e => list.includes(e)).length;
    const lastCh = [...hist].reverse().find(k => story.pages[k].ch);
    endEl.innerHTML = `<div style="width:100%;text-align:center"><span class="badge${isNew ? '' : ' old'}">${isNew ? '⭐ نهاية جديدة!' : '✓ النهاية'} ${num(got)} / ${num(ends.length)}</span></div>
      ${got < ends.length && lastCh ? `<button class="nb go" data-a="other">🔀 ${App.g('جرّبي', 'جرّب')} نهاية أخرى</button>` : ''}
      <button class="nb" data-a="again">🔄 من البداية</button><button class="nb" data-a="lib">📚 المكتبة</button>`;
    endEl.classList.remove('hidden');
    endEl.querySelector('[data-a="other"]') && endEl.querySelector('[data-a="other"]').addEventListener('click', () => { Sound.tap(); const k = hist.indexOf(lastCh); hist = hist.slice(0, k + 1); showPage(lastCh, -1); });
    endEl.querySelector('[data-a="again"]').addEventListener('click', () => { Sound.tap(); hist = []; showPage(story.start, -1); });
    endEl.querySelector('[data-a="lib"]').addEventListener('click', () => { Sound.tap(); renderLib(); });
    Sound.win(); burst();
    if (isNew) {
      App.addStars(2);
      App.achieve('stories_first');
      if (STORIES.every(s => (F[s.id] || []).length)) App.achieve('stories_six');
      if (STORIES.every(s => endingsOf(s).every(e => (F[s.id] || []).includes(e)))) App.achieve('stories_all');
    }
  }
  let parts = [];
  function burst() { for (let i = 0; i < 30; i++) { const a = Math.random() * TAU, v = 80 + Math.random() * 180; parts.push({ x: W / 2, y: H * .45, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: 1 + Math.random() * .6, age: 0, s: 4 + Math.random() * 5, c: ['#FFD84A', '#FF8BC2', '#8FE3FF', '#A8F0C6'][i % 4] }); } }

  goBtn.addEventListener('click', () => { const p = story && story.pages[pid]; if (!p || !p.next || turning) return; Sound.tap(); showPage(p.next, 1); });
  prevBtn.addEventListener('click', () => { if (hist.length < 2 || turning) return; Sound.tap(); hist.pop(); const k = hist[hist.length - 1]; showPage(k, -1); });
  root.querySelector('.nb.play').addEventListener('click', () => { if (!story) return; tasks = []; chsEl.classList.add('hidden'); narrate(story.pages[pid]); });
  libBtn.addEventListener('click', () => { Sound.tap(); renderLib(); });
  function setLang(l) { lang = l === 'en' ? 'en' : 'ar'; store.set('storiesLang', lang); root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang)); }
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return; Sound.tap(); setLang(b.dataset.l);
    if (view === 'lib') renderLib(); else { tasks = []; const h = hist.slice(); hist = h.slice(0, -1); showPage(pid, 0); }
  }));
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on') || view !== 'read') return;
    const p = story.pages[pid];
    if (e.key === 'Enter' || e.key === 'ArrowLeft' && lang === 'ar' || e.key === 'ArrowRight' && lang === 'en') { if (p.next) goBtn.click(); }
    else if (e.key === 'ArrowRight' && lang === 'ar' || e.key === 'ArrowLeft' && lang === 'en') prevBtn.click();
    else if (p.ch && (e.key === '1' || e.key === '2') && !chsEl.classList.contains('hidden')) choose(+e.key - 1);
  });

  /* ---------- الحلقة ---------- */
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
    if (paused || document.hidden) return;
    T += dt; sceneT += dt;
    for (let i = tasks.length - 1; i >= 0; i--) { const t = tasks[i]; t.t -= dt; if (t.t <= 0) { tasks.splice(i, 1); t.fn(); } }
    narStep(dt);
    if (view === 'read' && ctx && story) {
      ctx.clearRect(0, 0, W, H); drawScene(ctx, W, H, story.pages[pid], sceneT + 1);
      for (let i = parts.length - 1; i >= 0; i--) { const q = parts[i]; q.age += dt; if (q.age > q.life) { parts.splice(i, 1); continue; } q.vy += 200 * dt; q.x += q.vx * dt; q.y += q.vy * dt; ctx.globalAlpha = 1 - q.age / q.life; ctx.fillStyle = q.c; star5(ctx, q.x, q.y, q.s, q.age * 4); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
  }
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  let resizeT = 0;
  window.addEventListener('resize', () => { if (App.current !== ID) return; clearTimeout(resizeT); resizeT = setTimeout(() => { if (view === 'read') layout(); else renderLibCovers(); }, 100); });
  function renderLibCovers() { shelf.querySelectorAll('.cover').forEach((b, i) => { const f = fitCanvas(b.querySelector('canvas')); const s = BY[b.dataset.s]; drawScene(f.ctx, f.w, f.h, s.pages[s.start], 1.2 + i); }); }

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    const g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#FF9CC4'); g.addColorStop(1, '#FFD9A0'); c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.save(); c.globalAlpha = .9; sparkles(c, 1, 8, [10, 10, s - 20, s * .4]); c.restore();
    // كتاب مفتوح
    c.save(); c.translate(s / 2, s * .64);
    c.shadowColor = 'rgba(120,30,70,.3)'; c.shadowBlur = 10; c.shadowOffsetY = 5;
    for (const sd of [-1, 1]) { c.fillStyle = sd < 0 ? '#FFFFFF' : '#FFF7EC'; c.beginPath(); c.moveTo(0, -s * .2); c.quadraticCurveTo(sd * s * .2, -s * .27, sd * s * .4, -s * .22); c.lineTo(sd * s * .4, s * .16); c.quadraticCurveTo(sd * s * .2, s * .1, 0, s * .17); c.closePath(); c.fill(); }
    c.shadowColor = 'transparent';
    c.fillStyle = '#E2457F'; c.fillRect(-2, -s * .2, 4, s * .37);
    c.strokeStyle = 'rgba(160,120,140,.35)'; c.lineWidth = 2; for (const sd of [-1, 1]) for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(sd * s * .06, -s * .1 + k * s * .06); c.lineTo(sd * s * .33, -s * .12 + k * s * .06); c.stroke(); }
    c.restore();
    // نجمة ترتفع من الكتاب
    c.save(); c.scale(s / 152, s / 152); starChar(c, 76, 44, 1.05, { glow: .8, mood: 'happy' }, 0); c.restore();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'قصص تفاعلية', icon2: '📖', isNew: true, music: 'shapes',
    desc: () => App.g('اقرئي واختاري ماذا يحدث في القصة', 'اقرأ واختر ماذا يحدث في القصة'),
    help: () => [
      '📚 ' + App.g('اختاري', 'اختر') + ' قصة من المكتبة',
      '🔊 القصة تُقرأ جملةً جملة، ' + App.g('والمسي', 'والمس') + ' أي كلمة لتسمعها',
      '🔀 في بعض الصفحات ' + App.g('تختارين', 'تختار') + ' ماذا يحدث بعد ذلك!',
      '⭐ كل نهاية جديدة تمنحك نجمة على غلاف القصة',
      '🌍 زر «English» يقرأ القصة بالإنجليزية'
    ],
    icon,
    best() { const F = found(); const got = STORIES.reduce((a, s) => a + (F[s.id] || []).length, 0); return got ? `📖 ${got}/${TOTAL_ENDS} ⭐` : ''; },
    enter() { paused = false; setLang(store.get('storiesLang', 'ar')); renderLib(); startLoop(); },
    leave() { stopLoop(); tasks = []; stopNar(); },
    pause() { paused = true; },
    resume() { paused = false; last = performance.now(); },
    back() { if (view === 'read') { renderLib(); return true; } return false; },
    _state() { return { view, story: story && story.id, pid, hist: hist.slice(), lang, nar: !!nar, ch: !chsEl.classList.contains('hidden'), end: !endEl.classList.contains('hidden') }; },
    _data() { return STORIES; },
    _go(id, k) { if (!story || story.id !== id) openStory(id); hist = []; showPage(k, 0); }
  });
})();
