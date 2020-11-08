package com.memegle.server.changeLogs;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.memegle.server.model.Fact;
import com.memegle.server.model.Recommendation;
import com.memegle.server.repository.FactRepository;
import com.memegle.server.repository.RecommendationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// DON'T use @Autowired annotation in this class as documented on mongock documentation
// Parameters will be correctly connected to beans declared in the application context

// this class contains miscellaneous change logs other than changes to "pictures" collection
@ChangeLog
public class OtherChangelog {
    private final static Logger LOGGER = LoggerFactory.getLogger(OtherChangelog.class);

    @ChangeSet(author = "Paul", id = "addFacts1", order = "999")
    public void addFacts1(FactRepository factRepository) {
        LOGGER.info("adding facts");
        String[] facts = {
                "网络表情符号最早来自于1982年美国卡内基梅隆大学Scott E·Fahlman教授在BBS上首次使用的ASCII码”:-)”表示微笑。",
                "百度图片搜索“特朗普 表情包”可以找到30298张图片，而“拜登 表情包”只有499张。",
                "表情包的英文”Meme”来源于希腊单词”minema”，原义为“被滑稽模仿的事物”。",
                "第一个有记录的风靡英文网络的模因文化是Hampter the Hamster的<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://www.bilibili.com/video/BV18x411C7ft\">仓鼠歌</a>",
                "模因一词最早被用于英国演化生物学家理查德·道金斯的《自私的基因》一书中，被用以描述快速传播的新兴文化。他也是最早将文化现象比作病毒的人，由此衍生了将文化传播比作”似病毒肆虐般“的说法。",
                "互联网上的表情包数量如此之多，且每日新增的表情包数量是如此之大，以致于你穷尽一生也不可能数完他们；即便你真的花一辈子去数了，这段时间内新诞生的表情包又足够你花另一辈子去数了。",
                "如今在英文网络上，”表情包“被搜索的次数以多于”耶稣“被搜索的次数。",
                "将近60%的英文表情包具有政治内涵。",
                "风靡英文网络的表情包之一：<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://baike.baidu.com/item/%E5%93%88%E5%85%B0%E8%B4%9D/22253351?fr=aladdin\">哈兰贝大猩猩</a>",
                "特朗普签署行政命令的图片往往被外国网友恶搞，成为时下十分流行的表情包之一。",
                "风靡英文网络的表情包之一：<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://baike.baidu.com/item/%E4%B8%8D%E7%88%BD%E7%8C%AB/5753486?fr=aladdin\">不爽猫</a>",
                "中国如今的网络普及率约为42%。换言之，中国有约5.7亿的互联网用户。相比之下，美国的总人口数约为3.15亿。",
                "80%的中国网民年龄在10到40岁之间。",
                "全中国有大约有4.2亿的移动互联网用户，其中62%的用户年龄小于30岁。",
                "月均移动端交易金额达到5600万人民币——亦即每秒约有2100人民币的移动端交易被完成。",
                "91%的中国网民使用社交网络，而这一数字在美国是67%。",
                "中国制造了全世界百分之50%以上的手机，计算机和电视。",
                "中国有超过2.4亿人使用网络购物，比美国多7500万，是日本的两倍，英国的6倍。",
                "中国最大的搜索引擎依旧占据着76%的搜索引擎市场。",
                "75%的电商交易来源于手机。",
                "中国拥有全世界第一大和第二代的宽带运营商（分别是中国移动和中国电信）。",
                "游戏玩家占据网络用户群体的21%并平均每天花费3.2小时在线上。",
                "GIF动图的出现与Windows 2.0同期（1987年）。",
                "GIF动图真正才互联网上受欢迎是从2012年才开始的。",
                "Steve Wilhite，GIF格式的创造者之一，声明GIF的读音本应是”jiff”而非”giff”（尽管如今两种读法都被广泛接受）。",
                "含有GIF动图的推特比普通推特收获的互动要多67%。",
                "2020年3月，新冠病毒是全世界被搜索最多的关键词。",
                "全中国的城市中，北京和天津互联网用户的搜索条目中反应出最多的时政关注度。",
                "熊猫头表情包之所以经久不息，是因为其面孔往往使用其他风靡的网络表情包。",
                "最经典的熊猫头面孔来自张学友。",
                "暴走漫画于2008年中起源于英文论坛Reddit，同年王尼玛创建了baozou.com并开创了中文网络表情包的先河。",
        };

        for (String fact : facts) {
            if (factRepository.findByText(fact) == null)
                factRepository.save(new Fact(fact));
        }

    }

    @ChangeSet(author = "Paul", id = "addRecommendations1", order = "999")
    public void addRecommendations1(RecommendationRepository recommendationRepository) {
        LOGGER.info("adding recommendations");
        String[] recommendations = {
                "特朗普",
                "李云龙",
                "肖战",
                "你好",
                "晚安",
                "老年人",
                "土味情话",
                "宝宝心里苦",
                "黑人问号",
        };

        for (String keyword : recommendations) {
            recommendationRepository.save(new Recommendation(keyword));
        }

    }
}
