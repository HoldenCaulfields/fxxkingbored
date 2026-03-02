import { CollegeData, Member, Post, Competition, Story, StudyGroup, TimetableEntry, BeautyCandidate } from '@/types/cdn';

export const COLLEGE_DATA: CollegeData = {
  id: "cdn-ninh-thuan",
  name: "Trường Cao Đẳng Công Nghệ - Năng Lượng Khánh Hòa",
  shortName: "CDN Ninh Thuận",
  description: "Cao đẳng Nghề Ninh Thuận là trường đào tạo nguồn nhân lực chất lượng cao tại tỉnh Ninh Thuận, cung cấp các chương trình đào tạo về Công nghệ thông tin, Điện tử, Cơ khí, Ô tô, Du lịch - Khách sạn. Chúng tôi cam kết phát triển kỹ năng thực tiễn và kiến thức chuyên môn cho sinh viên.",
  location: [11.563022, 109.013219],
  avatar: "/cdn.png",
  cover: "/bgcdn.jpg",
  bio: "Cồng Đồng Dành Cho Sinh Viên CDN 🌟",
  address: "Đ.16/4, TP. Phan Rang - Tháp Chàm, Khánh Hòa",
  phone: "0259.3822.xxx",
  website: "http://cnn.edu.vn",
  stats: {
    members: 1250,
    posts: 450,
    groups: 24
  }
};

export const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Nguyễn Văn An', avatar: 'https://i.pravatar.cc/150?u=1', lat: 11.57, lng: 109.02, role: 'student', major: 'Công nghệ thông tin', joinedAt: '2023-09-01' },
  { id: '2', name: 'Trần Thị Bích', avatar: 'https://i.pravatar.cc/150?u=2', lat: 11.55, lng: 109.00, role: 'student', major: 'Điện tử công nghiệp', joinedAt: '2023-09-01' },
  { id: '3', name: 'Lê Văn Cường', avatar: 'https://i.pravatar.cc/150?u=3', lat: 11.58, lng: 109.01, role: 'student', major: 'Kỹ thuật ô tô', joinedAt: '2023-09-01' },
  { id: '4', name: 'Phạm Thị Diệu', avatar: 'https://i.pravatar.cc/150?u=4', lat: 11.54, lng: 109.03, role: 'student', major: 'Quản trị khách sạn', joinedAt: '2023-09-01' },
  { id: '5', name: 'Hoàng Văn Ết', avatar: 'https://i.pravatar.cc/150?u=5', lat: 11.59, lng: 109.04, role: 'student', major: 'Cơ khí chế tạo', joinedAt: '2023-09-01' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: 'Ban Quản Trị CDN',
    authorAvatar: '/cdn.png',
    content: '🎉 Chào mừng các tân sinh viên khóa 2024! Hãy cùng nhau tạo nên những kỷ niệm đẹp tại mái trường CDN Ninh Thuận. Đừng quên tham gia các câu lạc bộ và nhóm học tập nhé!',
    image: 'https://picsum.photos/seed/post1/800/500',
    likes: 120,
    comments: 45,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'p2',
    author: 'Nguyễn Văn An',
    authorAvatar: 'https://i.pravatar.cc/150?u=1',
    content: 'Buổi thực hành lập trình Python hôm nay tại phòng CNTT thật thú vị! 💻 Thầy Hùng hướng dẫn tụi mình làm project quản lý sinh viên. Ai chưa hoàn thành thì dm mình nhé!',
    image: 'https://picsum.photos/seed/post2/800/500',
    likes: 85,
    comments: 12,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'p3',
    author: 'Trần Thị Bích',
    authorAvatar: 'https://i.pravatar.cc/150?u=2',
    content: '⚡ Nhóm Điện tử tụi mình vừa hoàn thành mạch điều khiển motor bằng Arduino! Cảm ơn thầy Minh đã hỗ trợ. Dự án này sẽ được trình bày tại Ngày hội Sáng tạo Điện tử 2024 🔧',
    image: 'https://picsum.photos/seed/post3/800/500',
    likes: 203,
    comments: 38,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
];

export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'c1',
    title: 'English Speaking Contest 2024',
    description: 'Cuộc thi hùng biện Tiếng Anh dành cho sinh viên toàn trường. Chủ đề: "Technology changing our lives". Giải nhất 3.000.000đ!',
    image: 'https://picsum.photos/seed/english2024/400/300',
    status: 'ongoing',
    category: 'english',
    votes: 342,
    deadline: '2024-12-15',
    prize: '3.000.000đ'
  },
  {
    id: 'c2',
    title: 'Sáng tạo Điện tử CDN 2024',
    description: 'Trình diễn các sản phẩm điện tử sáng tạo: Robot, Mạch điện, IoT, Arduino... Dành cho sinh viên khoa Điện - Điện tử.',
    image: 'https://picsum.photos/seed/electronics2024/400/300',
    status: 'upcoming',
    category: 'electronics',
    votes: 156,
    deadline: '2024-12-25',
    prize: '5.000.000đ'
  },
  {
    id: 'c3',
    title: '🌸 Hoa Khôi CDN Ninh Thuận 2024',
    description: 'Tìm kiếm gương mặt đại diện cho vẻ đẹp, trí tuệ và tài năng của sinh viên CDN Ninh Thuận. Đăng ký ngay!',
    image: 'https://picsum.photos/seed/beauty2024/400/300',
    status: 'ongoing',
    category: 'beauty',
    votes: 891,
    deadline: '2024-12-20',
    prize: 'Vương miện + 10.000.000đ'
  },
  {
    id: 'c4',
    title: 'Khoảnh Khắc CDN – Ảnh Đẹp 2024',
    description: 'Ghi lại những khoảnh khắc đẹp nhất về mái trường, thầy cô, bạn bè tại CDN Ninh Thuận. Ảnh đẹp nhất win!',
    image: 'https://picsum.photos/seed/photo2024/400/300',
    status: 'ended',
    category: 'photo',
    votes: 524,
    deadline: '2024-11-30',
    prize: '2.000.000đ'
  },
  {
    id: 'c5',
    title: 'Lập trình Web CDN Cup',
    description: 'Cuộc thi lập trình web dành cho sinh viên CNTT. Thiết kế website giới thiệu Ninh Thuận đẹp nhất!',
    image: 'https://picsum.photos/seed/webdev2024/400/300',
    status: 'upcoming',
    category: 'other',
    votes: 87,
    deadline: '2025-01-10',
    prize: '4.000.000đ'
  }
];

export const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    studentName: 'Trần Thị Bích',
    avatar: 'https://i.pravatar.cc/150?u=2',
    content: 'Hành trình từ cô gái nhút nhát trở thành lớp trưởng năng nổ tại CDN 💪',
    image: 'https://picsum.photos/seed/story1/400/700',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 's2',
    studentName: 'Lê Văn Cường',
    avatar: 'https://i.pravatar.cc/150?u=3',
    content: 'Đêm thức trắng làm đồ án tốt nghiệp và sự hỗ trợ của thầy cô CDN 🌙',
    image: 'https://picsum.photos/seed/story2/400/700',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 's3',
    studentName: 'Nguyễn Văn An',
    avatar: 'https://i.pravatar.cc/150?u=1',
    content: 'Tự hào khi dự án Arduino của mình được chọn tham dự triển lãm toàn quốc! ⚡',
    image: 'https://picsum.photos/seed/story3/400/700',
    createdAt: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: 's4',
    studentName: 'Phạm Thị Diệu',
    avatar: 'https://i.pravatar.cc/150?u=4',
    content: 'Ngày đầu tiên thực tập tại khách sạn Ninh Thuận - mơ ước thành hiện thực! ✨',
    image: 'https://picsum.photos/seed/story4/400/700',
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
];

export const MOCK_STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'sg1',
    name: 'Nhóm Học Tiếng Anh 🇬🇧',
    subject: 'english',
    description: 'Luyện nói, nghe, đọc Tiếng Anh mỗi ngày. All levels welcome! Có native speaker hỗ trợ cuối tuần.',
    members: 28,
    maxMembers: 40,
    schedule: 'Thứ 2, 4, 6 – 18:00-19:30',
    room: 'Phòng Ngoại Ngữ A201',
    leader: 'Cô Thu Hà',
    leaderAvatar: 'https://i.pravatar.cc/150?u=10',
    isOpen: true,
  },
  {
    id: 'sg2',
    name: 'CLB Điện Tử Sáng Tạo ⚡',
    subject: 'electronics',
    description: 'Nghiên cứu Arduino, ESP32, IoT, Robot. Làm đồ án thực tế. Có xưởng thực hành hiện đại.',
    members: 22,
    maxMembers: 30,
    schedule: 'Thứ 3, 5 – 17:00-19:00',
    room: 'Xưởng Điện Tử B103',
    leader: 'Thầy Minh Khoa',
    leaderAvatar: 'https://i.pravatar.cc/150?u=11',
    isOpen: true,
  },
  {
    id: 'sg3',
    name: 'Nhóm Lập Trình CNTT 💻',
    subject: 'it',
    description: 'Web, Mobile, Python, Java. Làm project thật, chuẩn bị đi làm. Code review mỗi tuần.',
    members: 35,
    maxMembers: 50,
    schedule: 'Thứ 2, 4, 6 – 19:00-21:00',
    room: 'Phòng máy CNTT C201',
    leader: 'Thầy Hùng IT',
    leaderAvatar: 'https://i.pravatar.cc/150?u=12',
    isOpen: true,
  },
  {
    id: 'sg4',
    name: 'Nhóm Kỹ Thuật Ô Tô 🚗',
    subject: 'auto',
    description: 'Thực hành sửa chữa ô tô, đọc mạch điện, chuẩn đoán lỗi OBD. Xưởng thực hành tại trường.',
    members: 18,
    maxMembers: 25,
    schedule: 'Thứ 7 – 08:00-11:00',
    room: 'Xưởng Ô Tô D001',
    leader: 'Thầy Quang Bảo',
    leaderAvatar: 'https://i.pravatar.cc/150?u=13',
    isOpen: false,
  },
  {
    id: 'sg5',
    name: 'CLB Nghiệp Vụ Du Lịch 🌴',
    subject: 'tourism',
    description: 'Kỹ năng lễ tân, hướng dẫn viên, pha chế. Thực hành tại khách sạn đối tác ở Ninh Thuận.',
    members: 20,
    maxMembers: 30,
    schedule: 'Thứ 4, 7 – 15:00-17:00',
    room: 'Phòng Du Lịch A102',
    leader: 'Cô Lan Anh',
    leaderAvatar: 'https://i.pravatar.cc/150?u=14',
    isOpen: true,
  },
];

export const MOCK_TIMETABLE: TimetableEntry[] = [
  // Monday
  { id: 't1', subject: 'Lập trình Python', teacher: 'Thầy Hùng', room: 'CNTT-C201', dayOfWeek: 1, startPeriod: 1, endPeriod: 3, class: 'CNTT22A', color: '#3b82f6' },
  { id: 't2', subject: 'Mạch điện tử', teacher: 'Thầy Minh', room: 'ĐT-B103', dayOfWeek: 1, startPeriod: 4, endPeriod: 6, class: 'ĐT22B', color: '#f59e0b' },
  // Tuesday
  { id: 't3', subject: 'Tiếng Anh CB', teacher: 'Cô Thu Hà', room: 'NN-A201', dayOfWeek: 2, startPeriod: 1, endPeriod: 3, class: 'CNTT22A', color: '#10b981' },
  { id: 't4', subject: 'Kỹ thuật ô tô', teacher: 'Thầy Bảo', room: 'ÔT-D001', dayOfWeek: 2, startPeriod: 4, endPeriod: 7, class: 'OT22A', color: '#ef4444' },
  // Wednesday
  { id: 't5', subject: 'Lập trình Web', teacher: 'Thầy Hùng', room: 'CNTT-C201', dayOfWeek: 3, startPeriod: 1, endPeriod: 4, class: 'CNTT22A', color: '#3b82f6' },
  { id: 't6', subject: 'Arduino & IoT', teacher: 'Thầy Minh', room: 'ĐT-B103', dayOfWeek: 3, startPeriod: 5, endPeriod: 7, class: 'ĐT22B', color: '#f59e0b' },
  // Thursday
  { id: 't7', subject: 'Tiếng Anh CB', teacher: 'Cô Thu Hà', room: 'NN-A201', dayOfWeek: 4, startPeriod: 1, endPeriod: 3, class: 'CNTT22A', color: '#10b981' },
  { id: 't8', subject: 'Cơ sở dữ liệu', teacher: 'Thầy Nam', room: 'CNTT-C202', dayOfWeek: 4, startPeriod: 4, endPeriod: 6, class: 'CNTT22A', color: '#8b5cf6' },
  // Friday
  { id: 't9', subject: 'Thực hành Python', teacher: 'Thầy Hùng', room: 'CNTT-C201', dayOfWeek: 5, startPeriod: 1, endPeriod: 5, class: 'CNTT22A', color: '#3b82f6' },
  { id: 't10', subject: 'Lắp ráp mạch', teacher: 'Thầy Minh', room: 'ĐT-B103', dayOfWeek: 5, startPeriod: 1, endPeriod: 5, class: 'ĐT22B', color: '#f59e0b' },
];

export const MOCK_BEAUTY_CANDIDATES: BeautyCandidate[] = [
  { id: 'b1', name: 'Nguyễn Thị Hồng Nhung', major: 'Quản trị Du lịch', year: 2, avatar: 'https://i.pravatar.cc/150?u=20', votes: 1243, bio: 'Yêu âm nhạc, thích khám phá vẻ đẹp của Ninh Thuận. Mơ ước trở thành hướng dẫn viên du lịch quốc tế 🌺' },
  { id: 'b2', name: 'Trần Thị Phương Linh', major: 'Kế toán doanh nghiệp', year: 3, avatar: 'https://i.pravatar.cc/150?u=21', votes: 987, bio: 'Học giỏi, nhiệt tình trong các hoạt động tập thể. Đam mê múa và hát 💃' },
  { id: 'b3', name: 'Lê Thị Kim Anh', major: 'CNTT - Mạng máy tính', year: 2, avatar: 'https://i.pravatar.cc/150?u=22', votes: 876, bio: 'Con gái IT cũng xinh và giỏi lắm nha! Đại diện cho nữ sinh CNTT CDN 💻✨' },
  { id: 'b4', name: 'Phạm Thị Thanh Thảo', major: 'Điện - Điện tử', year: 2, avatar: 'https://i.pravatar.cc/150?u=23', votes: 654, bio: 'Yêu thích khoa học kỹ thuật, muốn chứng minh phụ nữ cũng làm được kỹ sư điện 🔋' },
  { id: 'b5', name: 'Võ Thị Ngọc Mai', major: 'Kế toán doanh nghiệp', year: 3, avatar: 'https://i.pravatar.cc/150?u=24', votes: 512, bio: 'Yêu thiên nhiên Ninh Thuận. Mỗi cuối tuần đạp xe khám phá đồng muối, vườn nho 🍇' },
];
