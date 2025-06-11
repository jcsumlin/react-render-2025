# GitBey MVP Implementation Specification

## Overview
This specification outlines the functional implementation plan for GitBey's Minimum Viable Product (MVP). The MVP focuses on core functionality: GitHub username input, commit analysis, sentiment classification, and Beyoncé song recommendations.

**Target Timeline**: 4-6 weeks
**Core Goal**: Validate the concept with a simple, working app that demonstrates the GitHub-to-music recommendation pipeline.

---

## Feature 1: GitHub Username Input & Validation

### Objective
Create a simple input interface for users to enter their GitHub username and validate that the user exists and has public repositories.

### Implementation Steps

#### Step 1.1: Design Simple Input UI
- **Objective**: Create clean, intuitive username input screen
- **Steps**:
  1. Design Flutter screen with text input field
  2. Add GitBey branding and explanation text
  3. Include input validation styling (error states)
  4. Add "Analyze My Vibe" button

```pseudocode
class UsernameInputScreen extends StatefulWidget {
  TextEditingController usernameController
  FormKey formKey
  
  Widget build() {
    return Scaffold(
      body: Form(
        child: Column(
          GitBeyLogo(),
          ExplanationText("Enter your GitHub username to discover your coding vibe"),
          TextFormField(
            validator: validateUsername,
            decoration: "GitHub Username"
          ),
          ElevatedButton("Analyze My Vibe", onPressed: analyzeUser)
        )
      )
    )
  }
}
```

#### Step 1.2: Implement Username Validation
- **Objective**: Validate GitHub username format and existence
- **Steps**:
  1. Create regex validation for GitHub username format
  2. Make API call to GitHub to verify user exists
  3. Check if user has public repositories
  4. Display appropriate error messages

```pseudocode
function validateUsername(username) {
  if (!username.matches(/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i)) {
    return "Invalid GitHub username format"
  }
  
  try {
    response = await GitHubAPI.getUser(username)
    if (response.public_repos === 0) {
      return "No public repositories found"
    }
    return null // Valid
  } catch (error) {
    return "GitHub user not found"
  }
}
```

**User Intervention Required**: None

---

## Feature 2: GitHub Commit Data Retrieval

### Objective
Fetch the last 25 commits from user's public repositories via GitHub API and extract commit messages for analysis.

### Implementation Steps

#### Step 2.1: Set Up GitHub API Integration
- **Objective**: Configure GitHub API client with proper authentication
- **Steps**:
  1. Create GitHub API service class
  2. Set up API key management (environment variables)
  3. Implement rate limiting and error handling
  4. Add retry logic for failed requests

```pseudocode
class GitHubService {
  private apiKey = Environment.GITHUB_API_KEY
  private baseUrl = "https://api.github.com"
  
  async getUser(username) {
    return await httpClient.get(`${baseUrl}/users/${username}`, {
      headers: { Authorization: `token ${apiKey}` }
    })
  }
  
  async getUserRepositories(username) {
    return await httpClient.get(`${baseUrl}/users/${username}/repos`, {
      params: { sort: "updated", per_page: 10 }
    })
  }
}
```

#### Step 2.2: Fetch Recent Commits
- **Objective**: Retrieve last 25 commits across user's repositories
- **Steps**:
  1. Get user's public repositories
  2. Sort repositories by last activity
  3. Fetch commits from most active repositories
  4. Aggregate and sort commits by date
  5. Return most recent 25 commits

```pseudocode
async function fetchRecentCommits(username) {
  repos = await githubService.getUserRepositories(username)
  allCommits = []
  
  for (repo in repos.slice(0, 5)) { // Top 5 most active repos
    commits = await githubService.getRepositoryCommits(repo.name, username)
    allCommits.extend(commits.map(commit => ({
      message: commit.commit.message,
      date: commit.commit.author.date,
      repository: repo.name
    })))
  }
  
  return allCommits
    .sortBy(commit => commit.date)
    .reverse()
    .slice(0, 25)
}
```

**User Intervention Required**: 
- User must provide GitHub personal access token if rate limits are hit (handled gracefully with error message)

---

## Feature 3: Basic Sentiment Analysis

### Objective
Implement simple rule-based sentiment analysis to classify commit messages into positive, negative, or neutral categories.

### Implementation Steps

#### Step 3.1: Create Sentiment Classification Rules
- **Objective**: Define keyword-based sentiment scoring system
- **Steps**:
  1. Create positive, negative, and neutral keyword dictionaries
  2. Implement scoring algorithm based on keyword matches
  3. Add weighting for different types of commits
  4. Handle edge cases (empty messages, merge commits)

```pseudocode
class SentimentAnalyzer {
  positiveKeywords = ["fix", "add", "improve", "enhance", "complete", "success", "done", "working", "good"]
  negativeKeywords = ["bug", "error", "fail", "broke", "issue", "problem", "crash", "wrong", "wtf"]
  neutralKeywords = ["update", "refactor", "change", "modify", "clean", "merge", "initial"]
  
  analyzeSentiment(commitMessage) {
    message = commitMessage.toLowerCase()
    positiveScore = countMatches(message, positiveKeywords)
    negativeScore = countMatches(message, negativeKeywords)
    neutralScore = countMatches(message, neutralKeywords)
    
    if (positiveScore > negativeScore && positiveScore > 0) {
      return "positive"
    } else if (negativeScore > positiveScore && negativeScore > 0) {
      return "negative"
    } else {
      return "neutral"
    }
  }
}
```

#### Step 3.2: Aggregate Sentiment Analysis
- **Objective**: Analyze all commits and determine overall coding mood
- **Steps**:
  1. Process each commit message through sentiment analyzer
  2. Weight recent commits more heavily (last 10 commits = 2x weight)
  3. Calculate overall sentiment distribution
  4. Determine dominant mood category

```pseudocode
function analyzeOverallSentiment(commits) {
  sentimentScores = { positive: 0, negative: 0, neutral: 0 }
  
  commits.forEach((commit, index) => {
    sentiment = sentimentAnalyzer.analyzeSentiment(commit.message)
    weight = index < 10 ? 2 : 1 // Recent commits weighted more
    sentimentScores[sentiment] += weight
  })
  
  dominantSentiment = Object.keys(sentimentScores)
    .reduce((a, b) => sentimentScores[a] > sentimentScores[b] ? a : b)
  
  return {
    dominant: dominantSentiment,
    distribution: sentimentScores,
    confidence: sentimentScores[dominantSentiment] / totalScore
  }
}
```

**User Intervention Required**: None

---

## Feature 4: Beyoncé Song Database & Mapping

### Objective
Create a curated database of Beyoncé songs categorized by mood and implement mapping algorithm from sentiment to songs.

### Implementation Steps

#### Step 4.1: Build Song Database
- **Objective**: Create static database of Beyoncé songs with mood categorization
- **Steps**:
  1. Research and categorize 30-50 popular Beyoncé songs
  2. Create JSON database with song metadata
  3. Include Spotify/Apple Music IDs for deep linking
  4. Add mood categories (positive, negative, neutral, energetic, chill)

```pseudocode
// beyonce_songs.json
{
  "positive": [
    {
      "title": "Crazy in Love",
      "album": "Dangerously in Love",
      "year": 2003,
      "spotify_id": "5IVuqXILoxVWvWEPm82Jxr",
      "mood_tags": ["energetic", "confident", "celebratory"],
      "reasoning": "High energy track perfect for successful coding sessions"
    },
    {
      "title": "Formation",
      "album": "Lemonade",
      "year": 2016,
      "spotify_id": "4i9sYtSIlR80bxje5B3rUb",
      "mood_tags": ["empowering", "confident", "fierce"],
      "reasoning": "Empowering anthem for conquering coding challenges"
    }
  ],
  "negative": [
    {
      "title": "Sorry",
      "album": "Lemonade", 
      "year": 2016,
      "spotify_id": "0y7zSAhz0BQjjB7vM5jYv",
      "mood_tags": ["cathartic", "emotional", "release"],
      "reasoning": "Perfect for processing debugging frustrations"
    }
  ],
  "neutral": [
    {
      "title": "Halo",
      "album": "I Am... Sasha Fierce",
      "year": 2008,
      "spotify_id": "4JehYebiI9JE8sR8MisGVb",
      "mood_tags": ["peaceful", "focused", "steady"],
      "reasoning": "Calm energy for steady, productive coding"
    }
  ]
}
```

#### Step 4.2: Implement Song Recommendation Algorithm
- **Objective**: Map sentiment analysis results to appropriate Beyoncé songs
- **Steps**:
  1. Load song database based on dominant sentiment
  2. Apply randomization to prevent repetitive results
  3. Select 3 songs with different energy levels
  4. Include reasoning for each recommendation

```pseudocode
class SongRecommendationEngine {
  songDatabase = loadBeyonceSongs()
  
  generateRecommendations(sentimentAnalysis) {
    dominantMood = sentimentAnalysis.dominant
    availableSongs = songDatabase[dominantMood]
    
    // Select 3 songs with variety
    recommendations = []
    usedSongs = Set()
    
    while (recommendations.length < 3 && availableSongs.length > 0) {
      randomSong = selectRandom(availableSongs.filter(song => !usedSongs.has(song.title)))
      recommendations.push({
        ...randomSong,
        matchReason: generateMatchReason(sentimentAnalysis, randomSong)
      })
      usedSongs.add(randomSong.title)
    }
    
    return recommendations
  }
  
  generateMatchReason(sentiment, song) {
    return `Based on your ${sentiment.dominant} coding vibe: ${song.reasoning}`
  }
}
```

**User Intervention Required**: 
- Manual curation of song database (one-time setup)
- Periodic updates to song selection for freshness

---

## Feature 5: Results Display & Music Integration

### Objective
Display song recommendations with album art, metadata, and provide links to external music services.

### Implementation Steps

#### Step 5.1: Design Results Screen
- **Objective**: Create attractive results display with song information
- **Steps**:
  1. Design card-based layout for each song recommendation
  2. Display album art, song title, album, and year
  3. Show personalized reason for recommendation
  4. Add action buttons for music service links

```pseudocode
class RecommendationsScreen extends StatelessWidget {
  final List<SongRecommendation> recommendations
  final SentimentAnalysis sentimentData
  
  Widget build() {
    return Scaffold(
      appBar: AppBar(title: "Your GitBey Playlist"),
      body: Column([
        SentimentSummaryCard(sentimentData),
        ...recommendations.map(song => SongRecommendationCard(song))
      ])
    )
  }
}

class SongRecommendationCard extends StatelessWidget {
  Widget build() {
    return Card(
      child: Column([
        Image.network(song.albumArt),
        Text(song.title, style: headline),
        Text("${song.album} (${song.year})", style: subtitle),
        Text(song.matchReason, style: caption),
        Row([
          ElevatedButton("Open in Spotify", onPressed: openSpotify),
          ElevatedButton("Open in Apple Music", onPressed: openAppleMusic)
        ])
      ])
    )
  }
}
```

#### Step 5.2: Implement Music Service Integration
- **Objective**: Provide deep links to open songs in music streaming apps
- **Steps**:
  1. Generate Spotify and Apple Music deep links
  2. Implement fallback to web players if apps not installed
  3. Add analytics tracking for link clicks
  4. Handle errors gracefully

```pseudocode
class MusicServiceLauncher {
  openSpotify(spotifyId) {
    spotifyUrl = "spotify:track:${spotifyId}"
    webFallback = "https://open.spotify.com/track/${spotifyId}"
    
    if (canLaunch(spotifyUrl)) {
      launch(spotifyUrl)
    } else {
      launch(webFallback)
    }
    
    analytics.track("song_opened", { service: "spotify", songId: spotifyId })
  }
  
  openAppleMusic(songTitle, artist) {
    searchQuery = encodeURIComponent("${songTitle} ${artist}")
    appleMusicUrl = "https://music.apple.com/search?term=${searchQuery}"
    launch(appleMusicUrl)
    
    analytics.track("song_opened", { service: "apple_music", song: songTitle })
  }
}
```

**User Intervention Required**: 
- Users need Spotify/Apple Music apps installed for best experience
- Users may need to authenticate with music services

---

## Feature 6: Basic Sharing Functionality

### Objective
Enable users to share their GitBey results via social media and clipboard for viral growth.

### Implementation Steps

#### Step 6.1: Generate Shareable Content
- **Objective**: Create formatted text for sharing GitBey results
- **Steps**:
  1. Format results into shareable text snippet
  2. Include GitHub username and dominant mood
  3. List recommended songs with brief reasoning
  4. Add GitBey branding and call-to-action

```pseudocode
class ShareContentGenerator {
  generateShareText(username, sentimentAnalysis, recommendations) {
    moodEmoji = getMoodEmoji(sentimentAnalysis.dominant)
    
    shareText = """
🎵 My GitBey coding vibe: ${sentimentAnalysis.dominant} ${moodEmoji}
    
Based on my recent GitHub commits, here's my Beyoncé playlist:
${recommendations.map(song => `• ${song.title} - ${song.album}`).join('\n')}

What's your coding vibe? Try GitBey! 🚀
#GitBey #Beyonce #CodingPlaylist #GitHub
    """
    
    return shareText.trim()
  }
  
  getMoodEmoji(mood) {
    emojiMap = {
      "positive": "✨",
      "negative": "💪", 
      "neutral": "🎯"
    }
    return emojiMap[mood] || "🎵"
  }
}
```

#### Step 6.2: Implement Share Actions
- **Objective**: Provide multiple sharing options (copy, Twitter, etc.)
- **Steps**:
  1. Add share button to results screen
  2. Implement copy to clipboard functionality
  3. Add direct social media sharing options
  4. Track sharing events for analytics

```pseudocode
class ShareManager {
  shareResults(shareContent) {
    showModalBottomSheet(
      context: context,
      builder: ShareOptionsModal([
        ShareOption("Copy to Clipboard", copyToClipboard),
        ShareOption("Share to Twitter", shareToTwitter),
        ShareOption("Share to Instagram Stories", shareToInstagram),
        ShareOption("More Options", showSystemShareSheet)
      ])
    )
  }
  
  copyToClipboard(content) {
    Clipboard.setData(ClipboardData(text: content))
    showSnackBar("Copied to clipboard! 📋")
    analytics.track("content_shared", { method: "clipboard" })
  }
  
  shareToTwitter(content) {
    twitterUrl = "https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}"
    launch(twitterUrl)
    analytics.track("content_shared", { method: "twitter" })
  }
}
```

**User Intervention Required**: 
- Users choose sharing method and complete sharing action
- Users may need to authenticate with social media platforms

---

## Technical Infrastructure Setup

### Backend API Development

#### Objective
Create simple Express.js API to handle GitHub integration and serve song recommendations.

#### Implementation Steps

1. **Set up Express.js server with TypeScript**
2. **Create GitHub API integration endpoints**
3. **Implement sentiment analysis service**
4. **Add song recommendation logic**
5. **Deploy to Heroku or Vercel**

```pseudocode
// server.ts
app.post('/api/analyze', async (req, res) => {
  const { username } = req.body
  
  try {
    // Fetch commits
    const commits = await githubService.fetchRecentCommits(username)
    
    // Analyze sentiment
    const sentiment = await sentimentService.analyzeCommits(commits)
    
    // Get recommendations
    const recommendations = await songService.getRecommendations(sentiment)
    
    res.json({
      success: true,
      data: {
        username,
        sentiment,
        recommendations,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})
```

### Database Setup

#### Objective
Set up PostgreSQL database for caching and basic analytics.

```pseudocode
// Database Schema
CREATE TABLE analysis_cache (
  id SERIAL PRIMARY KEY,
  github_username VARCHAR(255) NOT NULL,
  sentiment_data JSONB,
  recommendations JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX ON analysis_cache (github_username);
CREATE INDEX ON analysis_cache (created_at);
```

**User Intervention Required**:
- Set up Heroku account and database
- Configure environment variables for API keys
- Deploy backend service

---

## Testing & Validation

### MVP Success Criteria
1. **Functional**: App successfully analyzes GitHub users and returns song recommendations
2. **Performance**: Complete analysis within 10 seconds
3. **Usability**: Users can complete full flow without confusion
4. **Shareability**: Users can easily share results

### Testing Plan
1. **Unit Tests**: Test sentiment analysis accuracy with sample commit messages
2. **Integration Tests**: Test full GitHub API integration flow
3. **User Testing**: Test with 5-10 developers for usability feedback
4. **Performance Testing**: Test with users having large commit histories

**User Intervention Required**:
- Recruit beta testers from developer community
- Gather feedback and iterate on UX
- Test with various GitHub account types (new users, power users, etc.)

---

## Deployment & Launch

### Pre-Launch Checklist
1. Backend API deployed and tested
2. Flutter apps built for iOS and Android
3. Song database populated and verified
4. Error handling and edge cases covered
5. Analytics tracking implemented
6. App store listings prepared

### Launch Strategy
1. **Soft Launch**: Share with developer friends and community
2. **Social Media**: Post on Twitter, LinkedIn, dev communities
3. **Product Hunt**: Submit for featured launch
4. **Developer Communities**: Share on Reddit r/programming, Hacker News

**User Intervention Required**:
- Create Apple Developer and Google Play Console accounts
- Submit apps for review
- Prepare marketing materials and social media content
- Coordinate launch timing with community engagement

---

## Risk Mitigation

### Technical Risks
- **GitHub API Rate Limits**: Implement caching and user-specific tokens
- **Sentiment Analysis Accuracy**: Start simple, improve based on feedback
- **Music Service Integration**: Use web fallbacks if apps unavailable

### Business Risks  
- **Low User Engagement**: Focus on shareability and viral mechanics
- **Copyright Issues**: Only use deep links, no music hosting
- **Platform Dependency**: Ensure graceful degradation if APIs change

**User Intervention Required**:
- Monitor app performance and user feedback post-launch
- Be prepared to iterate quickly based on real user behavior
- Have backup plans for critical dependencies

---

This specification provides a comprehensive roadmap for implementing GitBey's MVP while keeping the complexity manageable and focused on core value proposition validation.
