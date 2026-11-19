// Les 3 premiers projets. Chacun se débloque quand le précédent est terminé.
// lessons : les leçons utilisées dans ce projet.
export const STARTERS = [
  {
    id: 'dishcloth',
    emoji: '🧽',
    needles: '4',
    lessons: ['cast-on', 'knit', 'garter', 'bind-off', 'weave-ends'],
    fr: {
      name: 'Une lavette',
      intro: 'Un petit carré de cuisine, environ 20 × 20 cm. On ne fait que des mailles endroit.',
      material: [
        '1 pelote de coton (50 g)',
        'Aiguilles 4 ou 4,5 mm',
        'Une aiguille à laine et des ciseaux',
      ],
      steps: [
        'Montez 35 mailles.',
        'Tricotez tous les rangs en maille endroit (point mousse).',
        'Continuez jusqu’à avoir un carré : pliez un coin en triangle. Si le bord touche l’autre coin, c’est carré (environ 70 rangs).',
        'Rabattez toutes les mailles.',
        'Cachez les deux bouts de fil.',
      ],
    },
    ar: {
      name: 'منشفة صغيرة للمطبخ',
      intro: 'مربع صغير للمطبخ، حوالي 20 × 20 سم. فقط غرز سادة.',
      material: [
        'كبة قطن واحدة (50 غ)',
        'إبر 4 أو 4.5 مم',
        'إبرة صوف ومقص',
      ],
      steps: [
        'ركّبي 35 غرزة.',
        'احيكي كل الصفوف بالغرزة السادة (غرزة موس).',
        'استمري حتى يصبح مربعاً: اطوي زاوية على شكل مثلث. إذا وصلت الحافة إلى الزاوية الأخرى فهو مربع (حوالي 70 صفاً).',
        'اقفلي كل الغرز.',
        'أخفي طرفي الخيط.',
      ],
    },
  },
  {
    id: 'scarf',
    emoji: '🧣',
    needles: '5',
    lessons: ['purl', 'rib-2x2', 'new-ball', 'dropped'],
    fr: {
      name: 'Une écharpe',
      intro: 'Une écharpe en côtes, douce et élastique, environ 150 cm de long. On apprend la maille envers.',
      material: [
        '4 à 5 pelotes de laine ou d’acrylique moyen (50 g chacune)',
        'Aiguilles 5 mm',
        'Une aiguille à laine',
      ],
      steps: [
        'Montez 30 mailles.',
        'Rang 1 : 2 mailles endroit, 2 mailles envers, et ainsi de suite. Finissez par 2 mailles endroit.',
        'Rang 2 : 2 mailles envers, 2 mailles endroit, et ainsi de suite. Finissez par 2 mailles envers.',
        'Répétez ces 2 rangs. Utilisez le compteur pour savoir où vous en êtes.',
        'Quand une pelote se termine, changez au début d’un rang.',
        'À 150 cm (ou la longueur voulue), rabattez en suivant les côtes et cachez les fils.',
      ],
    },
    ar: {
      name: 'وشاح (شال)',
      intro: 'وشاح بالضلوع، ناعم ومطاطي، طوله حوالي 150 سم. نتعلم فيه الغرزة المقلوبة.',
      material: [
        '4 إلى 5 كبب صوف أو أكريليك متوسط (50 غ لكل واحدة)',
        'إبر 5 مم',
        'إبرة صوف',
      ],
      steps: [
        'ركّبي 30 غرزة.',
        'الصف 1: غرزتان سادة، غرزتان مقلوبتان، وهكذا. اختمي بغرزتين سادة.',
        'الصف 2: غرزتان مقلوبتان، غرزتان سادة، وهكذا. اختمي بغرزتين مقلوبتين.',
        'كرري هذين الصفين. استعملي العداد لتعرفي أين وصلتِ.',
        'عندما تنتهي الكبة، غيّري في بداية الصف.',
        'عند 150 سم (أو الطول الذي تريدينه)، اقفلي الغرز حسب الضلوع وأخفي الخيوط.',
      ],
    },
  },
  {
    id: 'hat',
    emoji: '🧢',
    needles: '5',
    lessons: ['stockinette', 'k2tog', 'seaming'],
    fr: {
      name: 'Un bonnet simple',
      intro: 'Un bonnet adulte, tricoté à plat puis cousu. On apprend à diminuer et à coudre.',
      material: [
        '2 pelotes de laine moyenne (50 g chacune)',
        'Aiguilles 5 mm',
        'Une aiguille à laine',
      ],
      steps: [
        'Montez 90 mailles.',
        'Bordure : tricotez en côtes 2/2, comme l’écharpe, sur 6 cm.',
        'Ensuite, jersey : 1 rang endroit, 1 rang envers, jusqu’à 16 cm depuis le début.',
        'Diminutions, sur un rang endroit : *7 mailles endroit, 2 mailles ensemble* — répétez jusqu’au bout (80 mailles). Puis 1 rang envers.',
        'Rang endroit suivant : *6 endroit, 2 ensemble* (70 mailles). 1 rang envers. Continuez ainsi avec 1 maille endroit de moins à chaque fois : 60, 50, 40, 30, 20, puis 10 mailles.',
        'Coupez le fil en laissant 40 cm. Passez-le dans les 10 mailles avec l’aiguille à laine et serrez bien.',
        'Cousez le côté du bonnet avec ce fil, puis cachez les bouts.',
      ],
    },
    ar: {
      name: 'قبعة بسيطة (طاقية)',
      intro: 'قبعة للكبار، تُحاك مسطحة ثم تُخاط. نتعلم التنقيص والخياطة.',
      material: [
        'كبتان من الصوف المتوسط (50 غ لكل واحدة)',
        'إبر 5 مم',
        'إبرة صوف',
      ],
      steps: [
        'ركّبي 90 غرزة.',
        'الحافة: احيكي ضلوع 2/2 مثل الوشاح، على 6 سم.',
        'بعدها الجيرسي: صف سادة، صف مقلوب، حتى 16 سم من البداية.',
        'التنقيص في صف سادة: *7 غرز سادة، غرزتان معاً* — كرري حتى النهاية (80 غرزة). ثم صف مقلوب.',
        'الصف السادة التالي: *6 سادة، غرزتان معاً* (70 غرزة). صف مقلوب. استمري هكذا بغرزة سادة أقل كل مرة: 60، 50، 40، 30، 20، ثم 10 غرز.',
        'اقطعي الخيط واتركي 40 سم. مرّريه في الغرز العشر بإبرة الصوف واشدّي جيداً.',
        'خيطي جانب القبعة بنفس الخيط، ثم أخفي الأطراف.',
      ],
    },
  },
];
