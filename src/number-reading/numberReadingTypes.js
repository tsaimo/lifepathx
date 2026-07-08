import lifePathReadings from './lifePathReadings.json'

function buildAdviceGuidance({ advice, strengths, challenges, keywords }) {
  const primaryStrength = strengths[0]
  const secondStrength = strengths[1]
  const primaryChallenge = challenges[0]
  const secondChallenge = challenges[1]
  const theme = keywords[0]

  return {
    self: [
      `先温柔地承认自己的${theme}需求，不必急着把它解释给所有人听。`,
      `把“${primaryStrength}”用在一个具体小行动上，今天先完成一步就很好。`,
      `当${primaryChallenge}出现时，先停一下，问问自己真正想保护的是什么。`,
      advice,
    ],
    relationship: [
      `如果你在看另一个人，先看见对方的${primaryStrength}，再谈期待和调整。`,
      `沟通时给对方一点准备空间，少用催促，多用清楚、具体的请求。`,
      `遇到${secondChallenge}时，不急着贴标签，先确认对方是不是累了或没有安全感。`,
      `相处里多创造能发挥${secondStrength}的场景，对方会更愿意靠近和配合。`,
    ],
  }
}

function buildMissingAdviceGuidance({ gap, avoid, reading }) {
  return {
    self: [
      `先把缺少 ${reading.number} 看成需要练习的能力，不是给自己扣分的标签。`,
      `从“${gap}”开始，选一个很小的日常场景慢慢练。`,
      `当你发现自己${avoid.replace('避免', '')}时，先停下来，给自己一点重新选择的空间。`,
      `可以借用身边擅长“${reading.keywords[0]}”的人做参照，但不需要一下子变成对方的样子。`,
    ],
    relationship: [
      `如果对方缺少 ${reading.number}，先理解这可能是他的短板，不一定是故意不配合。`,
      `沟通时把期待说得具体一点，别默认对方自然知道怎么补上“${gap}”。`,
      `看到对方${avoid.replace('避免', '')}时，少一点指责，多一点示范和边界。`,
      `相处中可以给对方低压力的练习机会，让改变有台阶可走。`,
    ],
  }
}

function withAdviceGuidance(reading) {
  return {
    ...reading,
    advice: buildAdviceGuidance(reading),
  }
}

const baseReadings = lifePathReadings
  .filter((reading) => reading.number >= 1 && reading.number <= 9)
  .map(withAdviceGuidance)
const masterReadings = lifePathReadings
  .filter((reading) => [11, 22, 33].includes(reading.number))
  .map(withAdviceGuidance)

const birthdayNotes = {
  1: ['主动表达需求', '把个人风格放到台前', '避免急着争第一'],
  2: ['先感受关系氛围', '适合做连接和协调', '避免过度等待回应'],
  3: ['用语言和创意打开局面', '适合分享想法', '避免只有灵感没有收尾'],
  4: ['用稳定习惯建立安全感', '适合处理细节', '避免把自己框得太紧'],
  5: ['需要变化和体验感', '适合快速适应新环境', '避免承诺前没有想清后果'],
  6: ['天然关注照顾和责任', '适合维护关系质量', '避免把关心变成压力'],
  7: ['喜欢先观察再投入', '适合研究和独处思考', '避免把距离当成保护'],
  8: ['对结果和资源敏感', '适合承担目标', '避免用成败定义自己'],
  9: ['容易看见整体和他人处境', '适合整合经验', '避免替所有人负责'],
}

const talentNotes = {
  1: ['启动项目', '做清晰判断', '把想法推到第一步'],
  2: ['读懂情绪', '促成合作', '在冲突中寻找平衡点'],
  3: ['表达、创作和包装信息', '活跃气氛', '把复杂内容讲得有画面'],
  4: ['搭建流程', '整理资源', '把计划落实到日程和清单'],
  5: ['应对变化', '连接新机会', '在不确定里找到路径'],
  6: ['照顾体验', '稳定关系', '让环境更舒适有序'],
  7: ['分析问题', '追问原因', '从信息里提炼洞察'],
  8: ['管理目标和资源', '推动结果', '在压力下做取舍'],
  9: ['整合观点', '扩大视角', '把个人经验转化为帮助他人的方法'],
}

const missingNotes = {
  1: ['练习主动选择', '补足自我定义', '避免总等别人给方向'],
  2: ['练习倾听和协商', '补足关系敏感度', '避免忽略细微感受'],
  3: ['练习表达和展示', '补足轻松沟通', '避免把想法都留在脑内'],
  4: ['练习秩序和收尾', '补足稳定执行', '避免只凭临场状态做事'],
  5: ['练习弹性和尝试', '补足变化适应力', '避免过度依赖熟悉路径'],
  6: ['练习承诺和照顾', '补足责任感表达', '避免只处理任务不经营关系'],
  7: ['练习独立思考', '补足深度复盘', '避免只看表面反馈'],
  8: ['练习资源意识', '补足现实目标感', '避免回避金钱、权责和边界'],
  9: ['练习放下和整合', '补足整体视角', '避免困在单点得失里'],
}

const missingZeroReading = {
  number: 0,
  title: '缺少 0：留白与潜能',
  summary:
    '空缺数 0 表示生日数字里没有出现“0”这组留白、放大和潜能经验。它不是传统九宫格里的主轴，但会提醒你练习允许未知、保留弹性，并把空白空间转化为真正可承接的可能性。',
  strengths: ['练习留白和弹性', '补足对未知的容纳', '需要刻意建立放大潜能的经验'],
  challenges: ['避免把空白都填满', '遇到不确定时更容易急着定论', '可能用过度安排掩盖不安全感'],
  advice: {
    self: [
      '先把缺少 0 看成需要练习的留白能力，不是给自己扣分的标签。',
      '从“补足对未知的容纳”开始，选一个很小的日常场景慢慢练。',
      '当你发现自己想把空白都填满时，先停下来，给自己一点重新选择的空间。',
      '可以借用身边擅长保留弹性的人做参照，但不需要一下子变成对方的样子。',
    ],
    relationship: [
      '如果对方缺少 0，先理解这可能是他面对未知时的短板，不一定是故意僵硬。',
      '沟通时把可选择范围说清楚，别默认对方自然知道怎么和不确定相处。',
      '看到对方急着定论时，少一点指责，多一点示范和边界。',
      '相处中可以给对方低压力的留白机会，让改变有台阶可走。',
    ],
  },
  keywords: ['留白', '潜能', '弹性'],
  practice: '练习留白和弹性',
}

export const birthdayRelatedDays = {
  1: [1, 10, 19, 28],
  2: [2, 22, 29],
  3: [3, 12, 21, 30],
  4: [4, 13, 31],
  5: [5, 14, 23],
  6: [6, 15, 24],
  7: [7, 16, 25],
  8: [8, 17, 26],
  9: [9, 18, 27],
}

const birthdayDayThemes = [
  ['开端行动者', '你习惯先动起来，用直接行动测试方向。适合发起任务、建立第一步，也要避免把速度当成唯一答案。', ['主动启动', '目标清楚', '敢于表达'], ['急于证明', '不耐等待', '忽略协作'], '把主导力用在明确方向上，同时给别人参与空间。'],
  ['关系协调者', '你对互动氛围很敏感，容易看见别人没说出口的需求。适合协调沟通，也要避免把自己的需求放到最后。', ['共情细腻', '善于配合', '关系敏感'], ['过度迁就', '害怕冲突', '立场摇摆'], '先确认自己的感受，再进入协商，会让温和更有力量。'],
  ['灵感表达者', '你容易用语言、创意和幽默打开局面。适合表达观点、连接人群，也要避免让灵感停在热闹里。', ['表达自然', '创意活跃', '感染力强'], ['分心', '承诺过多', '收尾不足'], '给创意设置完成标准，让表达沉淀成作品。'],
  ['秩序建造者', '你重视稳定、规则和可执行的计划。适合处理细节和长期任务，也要避免把变化都看成风险。', ['踏实可靠', '流程感强', '耐心足'], ['固执', '紧绷', '害怕失控'], '保留原则，也给方法留出调整空间。'],
  ['自由探索者', '你需要新鲜感和可选择的空间，常能在变化里找到机会。适合探索、传播和转换路径，也要留意持续性。', ['适应快', '好奇心强', '敢尝试'], ['冲动', '难坚持', '逃避限制'], '把自由变成节奏，而不是随时换方向。'],
  ['责任照护者', '你自然会关注关系质量、照顾体验和承诺。适合维护团队与家庭气氛，也要避免替所有人负责。', ['有责任感', '愿意照顾', '审美稳定'], ['过度承担', '难说不', '期待回报'], '先确认自己的容量，再决定能给出多少支持。'],
  ['深度探求者', '你习惯观察、分析和追问原因。适合研究、复盘和独立思考，也要避免把距离感当成安全感。', ['洞察强', '专注深入', '直觉清醒'], ['疏离', '怀疑过度', '表达保守'], '把理解说出来，关系和成果都会更容易落地。'],
  ['现实成就者', '你对结果、资源和影响力敏感。适合承担目标、管理资源，也要避免只用成败衡量价值。', ['执行强', '目标感强', '抗压'], ['控制欲', '忽略感受', '功利焦虑'], '把成果指标写清楚，也把关系和健康纳入指标。'],
  ['经验整合者', '你容易看见整体和他人的处境，适合总结经验、处理结束与转换。也要避免沉在旧故事里。', ['包容', '理想感', '能整合'], ['怀旧过度', '边界过宽', '替人负责'], '把善意落到具体行动，必要时也要允许结束。'],
  ['独立组织者', '你把 1 的启动力和 0 的放大感结合在一起，适合开局、整合资源并推动团队前进。', ['能开局', '组织方向', '行动果断'], ['压力独扛', '急着定调', '忽略反馈'], '先建立共识，再推进速度，成果会更稳。'],
  ['直觉启发者', '你对灵感、气氛和微妙变化很敏感，容易成为提醒方向的人。也要避免被高敏感消耗。', ['直觉强', '能启发人', '感知细'], ['焦虑', '能量过载', '落地不足'], '用记录、作息和小步验证承接灵感。'],
  ['合作表达者', '你适合把关系和表达结合起来，在团队中传递想法、缓和张力。也要避免为了被喜欢而模糊重点。', ['会沟通', '懂配合', '表达亲和'], ['讨好', '犹豫', '重点分散'], '表达前先抓住核心立场，再照顾语气。'],
  ['创意实践者', '你有表达欲，也需要把灵感落实成结构。适合内容、设计、教学和任何需要创意落地的工作。', ['创意强', '学习快', '能包装'], ['三分钟热度', '标准不稳', '情绪化'], '用清单和期限保护你的创造力。'],
  ['自由建造者', '你既需要变化，也需要一个可持续的底盘。适合在新领域建立方法，但要避免边做边推翻。', ['适应变化', '能搭框架', '实践感强'], ['不耐重复', '计划跳跃', '容易焦躁'], '先定底线和节奏，再给探索留空间。'],
  ['关系探索者', '你容易通过体验理解人和世界，适合社交、传播和跨领域连接。也要避免承诺过多。', ['开放', '会连接', '体验感强'], ['分散', '逃避约束', '关系边界弱'], '把每次探索沉淀成一个明确收获。'],
  ['理想照护者', '你把责任感和理想感结合起来，适合照顾、服务和改善环境。也要避免把爱变成控制。', ['愿意承担', '重视和谐', '有审美'], ['过度负责', '操心太多', '难放手'], '照顾别人时，也要让对方保留成长空间。'],
  ['独立研究者', '你需要自主空间来观察和判断，适合专业研究、策略分析和深度学习。也要练习及时沟通。', ['独立', '分析深', '判断清楚'], ['孤立', '不易求助', '过度审视'], '把阶段性结论说出来，不必等到完全确定。'],
  ['愿景实践者', '你有把理想推向现实的能力，既能看见人，也能看见结果。压力来自对自己要求过高。', ['格局感', '执行力', '能整合资源'], ['压力大', '控制强', '难放松'], '把大目标拆成阶段交付，别用一次成败定义全局。'],
  ['表达整合者', '你适合把复杂经验讲清楚，让别人从中获得启发。也要避免情绪和故事占满全部空间。', ['会表达', '共情强', '能总结'], ['理想化', '沉溺过去', '边界松'], '把感受转成可执行的建议，会更有影响力。'],
  ['敏感开创者', '你能感知他人，也有自己想推动的方向。适合在合作中发起新事物，但要避免一边迎合一边不满。', ['主动', '敏锐', '能协调'], ['内耗', '摇摆', '压抑需求'], '先说清目标和边界，再邀请别人同行。'],
  ['关系镜像者', '你对关系里的反馈特别敏感，适合陪伴、协作和理解他人。也要避免把外界评价当成全部依据。', ['倾听', '合作', '直觉'], ['依赖认可', '害怕冲突', '决策慢'], '把别人的反馈当信息，而不是身份判断。'],
  ['愿景协调者', '你能把理想、关系和执行连接起来，适合做长期项目的组织者。也要避免承担超出能力的责任。', ['组织力', '共识感', '能落地'], ['压力过高', '完美主义', '过度负责'], '把愿景拆给团队，而不是全部压在自己身上。'],
  ['表达建造者', '你适合把创意变成结构化内容或稳定产品。关键课题是持续打磨，而不是不断换题。', ['表达清楚', '结构感', '执行稳定'], ['挑剔', '卡细节', '灵感被规则压住'], '让规则服务表达，不要让规则取代表达。'],
  ['责任探索者', '你需要自由，也看重承诺。适合在变化中维护关系和体验，但要避免一时兴起带来后续压力。', ['适应力', '责任感', '会照顾体验'], ['纠结', '承诺摇摆', '逃避收尾'], '开始前先确认边界，结束时认真交代。'],
  ['深度表达者', '你有表达欲，也有追问本质的倾向。适合研究型表达、咨询、写作和教学。', ['洞察', '表达', '学习快'], ['想太多', '情绪内收', '不易完成'], '把复杂思考分层输出，不必一次讲完。'],
  ['现实照护者', '你会把责任落实到资源、安排和结果上。适合管理、运营和照顾实际需求。', ['务实', '可靠', '能承担'], ['控制', '操劳', '忽略情绪'], '让照顾也包含分工，不必凡事亲自处理。'],
  ['理想研究者', '你容易从经验中提炼意义，适合学习、研究和精神层面的探索。也要避免只停留在理解。', ['洞察', '理想感', '能复盘'], ['脱离现实', '疏离', '迟迟不行动'], '每次洞察都配一个现实行动。'],
  ['成就整合者', '你适合把资源和经验整合成结果，能在复杂局面里推动完成。也要避免把压力压到最后。', ['执行强', '整合力', '抗压'], ['硬撑', '控制欲', '情绪延后'], '定期检查节奏，让成果不是靠透支换来。'],
  ['直觉实践者', '你有主数 11 的敏感和启发，也需要用 2 的合作把灵感落地。适合引导、创作和陪伴。', ['灵感强', '会连接', '感知细'], ['焦虑', '过度敏感', '现实感不足'], '用稳定流程承接灵感，先小范围验证。'],
  ['表达服务者', '你适合用表达、照顾和教学支持他人。课题是服务时保留自我边界。', ['表达温暖', '愿意支持', '有感染力'], ['过度付出', '情绪外溢', '期待回报'], '把帮助说清范围，关系会更轻松。'],
  ['系统成就者', '你有主数 22 的建设潜力，也带有 4 的秩序和 8 的结果意识。适合长期系统和资源整合。', ['系统思维', '能落地', '目标感强'], ['压力过载', '控制过强', '不易休息'], '把雄心拆成稳定机制，并持续检查身体和关系成本。'],
]

function buildReadings(kind, notesByNumber) {
  return baseReadings.map((reading) => {
    const notes = notesByNumber[reading.number]

    return {
      number: reading.number,
      title: reading.title,
      summary: `${kind} ${reading.number} 继承“${reading.keywords.join('、')}”的主题，更强调它在${kind === '生日数' ? '日常反应和外在表现' : kind === '天赋数' ? '自然能力和做事优势' : '需要补课和刻意练习'}中的作用。${notes[0]}，同时要留意${notes[2]}。`,
      strengths: [notes[0], notes[1], reading.strengths[0]],
      challenges: [notes[2], reading.challenges[0], reading.challenges[1]],
      advice: buildAdviceGuidance({
        advice: `${notes[1]}是这个数字最适合被看见的位置。把它放进具体行动里，比只给自己贴标签更有价值。`,
        strengths: [notes[0], notes[1], reading.strengths[0]],
        challenges: [notes[2], reading.challenges[0], reading.challenges[1]],
        keywords: reading.keywords,
      }),
      keywords: reading.keywords,
    }
  })
}

function buildMissingReadings() {
  return baseReadings.map((reading) => {
    const [practice, gap, avoid] = missingNotes[reading.number]

    return {
      number: reading.number,
      title: `缺少 ${reading.number}：${reading.title}`,
      summary: `空缺数 ${reading.number} 表示生日数字里少了“${reading.keywords.join('、')}”这组经验，通常不是优势，而是容易不熟、回避或需要后天补课的地方。它提醒你留意${avoid}，并用温和的方式补上${gap}。`,
      strengths: [`缺少${reading.keywords[0]}的自然启动`, gap, `需要刻意建立${reading.keywords[1]}经验`],
      challenges: [avoid, `遇到${reading.challenges[0]}时更容易卡住`, `可能借用过度补偿来掩盖不熟悉`],
      advice: buildMissingAdviceGuidance({ gap, avoid, reading }),
      keywords: reading.keywords,
      practice,
    }
  })
}

function reduceToGridNumber(value) {
  let number = Number(value)

  while (number > 9) {
    number = String(number)
      .split('')
      .reduce((total, digit) => total + Number(digit), 0)
  }

  return number
}

function findBirthdayLinkedNumber(day) {
  const matchedEntry = Object.entries(birthdayRelatedDays).find(([, days]) => days.includes(day))

  return matchedEntry ? Number(matchedEntry[0]) : reduceToGridNumber(day)
}

function buildBirthdayDayReadings() {
  return birthdayDayThemes.map(([title, summary, strengths, challenges, advice], index) => {
    const day = index + 1
    const birthdayNumber = findBirthdayLinkedNumber(day)

    return {
      number: day,
      title: `${day} 日：${title}`,
      summary: `${summary} 这一天会进一步归约到生日数 ${birthdayNumber}，可同时参考九宫格中的 ${birthdayNumber} 号主题。`,
      strengths,
      challenges,
      advice: buildAdviceGuidance({
        advice: `${advice} 先从一个小行动开始验证，会更容易稳定下来。`,
        strengths,
        challenges,
        keywords: [`${day}日`, `生日数${birthdayNumber}`],
      }),
      keywords: [`${day}日`, `生日数${birthdayNumber}`],
      linkedNumber: birthdayNumber,
    }
  })
}

const birthdayDayReadings = buildBirthdayDayReadings()

export const readingTypes = [
  {
    id: 'destiny',
    label: '命运数',
    resultLabel: '命运数',
    eyebrow: 'Destiny Number',
    description: '从完整出生日期归约出的核心路径，延续当前生命灵数解读。',
    readings: baseReadings,
    extraReadings: masterReadings,
    rules: {
      title: '命运数怎么算',
      blocks: [
        {
          title: '基本公式',
          lines: ['命运数 = 归约(月) + 归约(日) + 归约(年)，再把总和继续归约。', '归约表示把数字逐位相加，直到得到 1-9；如果过程中得到 11、22、33，会先作为主数保留并显示在九宫格下方。'],
        },
        {
          title: '计算示例',
          lines: ['生日 1989-08-18：月 8；日 1 + 8 = 9；年 1 + 9 + 8 + 9 = 27，2 + 7 = 9。', '总和 8 + 9 + 9 = 26，2 + 6 = 8，所以命运数落在 8。'],
        },
      ],
    },
  },
  {
    id: 'birthday',
    label: '生日数',
    resultLabel: '生日数',
    eyebrow: 'Birthday Number',
    description: '由出生日期中的“日”归约而来，观察一个人自然流露的反应方式。',
    readings: buildReadings('生日数', birthdayNotes),
    detailLabel: '出生日',
    detailReadings: birthdayDayReadings,
    rules: {
      title: '生日数怎么算',
      blocks: [
        {
          title: '基本公式',
          lines: ['生日数 = 归约(出生日)。只取出生日期里的“日”，不加入月份和年份。', '如果出生日是个位数，直接使用；如果是两位数，就把两位相加到 1-9。'],
        },
        {
          title: '计算示例',
          lines: ['生日 1989-08-18：出生日是 18。', '1 + 8 = 9，所以生日数是 9。'],
        },
      ],
    },
  },
  {
    id: 'talent',
    label: '天赋数',
    resultLabel: '天赋数',
    eyebrow: 'Talent Number',
    description: '由月份和日期合并归约，观察更容易被调用的能力和做事优势。',
    readings: buildReadings('天赋数', talentNotes),
    rules: {
      title: '天赋数怎么算',
      blocks: [
        {
          title: '基本公式',
          lines: ['天赋数 = 归约(月 + 日)。它关注生日里较贴近日常行动的月份和日期。', '先把月份与日期相加，再逐位相加归约到 1-9。'],
        },
        {
          title: '计算示例',
          lines: ['生日 1989-08-18：月 8，日 18。', '8 + 18 = 26，2 + 6 = 8，所以天赋数是 8。'],
        },
      ],
    },
  },
  {
    id: 'connection',
    label: '连线解读',
    resultLabel: '连线',
    eyebrow: 'Connection Line',
    description: '由命运数、生日数、天赋数在九宫格内形成的路径，观察核心方向、自然反应和行动天赋之间的连接。',
    readings: baseReadings,
    sectionLabels: {
      strengths: '连线优势',
      challenges: '连线课题',
    },
    rules: {
      title: '连线怎么算',
      blocks: [
        {
          title: '基本公式',
          lines: ['连线 = 命运数根数、生日数、天赋数在九宫格中的位置。', '三个数字必须在九宫格上形成一条直线才连；如果不能形成直线，则任意两个数字刚好是相邻边的中点才连。'],
        },
        {
          title: '阅读方式',
          lines: ['先看实际连线经过哪些数字，再只解读这些数字组成的线段。', '这条线不是新的计算数字，而是帮助观察三个核心数字是否形成清晰的支撑、拉扯或互补路径。'],
        },
      ],
    },
  },
  {
    id: 'missing',
    label: '空缺数',
    resultLabel: '空缺数',
    eyebrow: 'Missing Number',
    description: '查看完整生日数字中没有出现的 0-9，提示更需要刻意练习的主题。',
    readings: buildMissingReadings(),
    extraReadings: [missingZeroReading],
    sectionLabels: {
      strengths: '需要补足',
      challenges: '容易卡住',
    },
    rules: {
      title: '空缺数怎么算',
      blocks: [
        {
          title: '基本公式',
          lines: ['空缺数 = 完整生日数字中没有出现的 0-9。0 会作为九宫格外的额外解读显示。', '把年月日写成 YYYYMMDD，检查 0 到 9 哪些数字没有出现。空缺数可能有多个，也可能很少。'],
        },
        {
          title: '计算示例',
          lines: ['生日 1989-08-18 写作 19890818，出现了 0、1、8、9。', '没有出现 2、3、4、5、6、7，所以这些都是空缺数。'],
        },
      ],
    },
  },
]

export function findReadingType(typeId) {
  return readingTypes.find((type) => type.id === typeId) ?? readingTypes[0]
}

export function getBirthdayRelatedDays(number) {
  return birthdayRelatedDays[number] ?? []
}
