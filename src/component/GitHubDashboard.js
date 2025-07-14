import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Spinner } from "react-bootstrap";

export const GitHubDashboard = () => {
  const [githubData, setGithubData] = useState({
    user: null,
    repos: [],
    commits: [],
    loading: true,
    error: null,
  });

  const USERNAME = "aryavhir"; // Replace with your GitHub username
  const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN; // Optional: for higher rate limits

  useEffect(() => {
    fetchGithubData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGithubData = async () => {
    try {
      const headers = GITHUB_TOKEN
        ? { Authorization: `token ${GITHUB_TOKEN}` }
        : {};

      // Fetch user data
      const userResponse = await fetch(
        `https://api.github.com/users/${USERNAME}`,
        { headers },
      );
      const userData = await userResponse.json();

      // Fetch pinned repositories
      const reposResponse = await fetch(
        `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`,
        { headers },
      );
      const reposData = await reposResponse.json();

      // Fetch recent commits from public repos
      const commitsPromises = reposData.slice(0, 3).map((repo) =>
        fetch(
          `https://api.github.com/repos/${USERNAME}/${repo.name}/commits?per_page=3`,
          { headers },
        )
          .then((res) => res.json())
          .then((commits) =>
            commits.map((commit) => ({ ...commit, repo: repo.name })),
          ),
      );

      const commitsArrays = await Promise.all(commitsPromises);
      const allCommits = commitsArrays.flat().slice(0, 5);

      setGithubData({
        user: userData,
        repos: reposData.slice(0, 6),
        commits: allCommits,
        loading: false,
        error: null,
      });
    } catch (error) {
      setGithubData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch GitHub data",
      }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3776ab",
      Java: "#b07219",
      React: "#61dafb",
      HTML: "#e34c26",
      CSS: "#1572b6",
      C: "#555555",
      "C++": "#f34b7d",
      Go: "#00add8",
      Rust: "#dea584",
      PHP: "#4f5d95",
    };
    return colors[language] || "#586069";
  };

  if (githubData.loading) {
    return (
      <section className="github-dashboard" id="github">
        <Container>
          <Row>
            <Col>
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading GitHub data...</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  if (githubData.error) {
    return (
      <section className="github-dashboard" id="github">
        <Container>
          <Row>
            <Col>
              <div className="text-center py-5">
                <p className="text-danger">{githubData.error}</p>
                <button className="btn btn-primary" onClick={fetchGithubData}>
                  Retry
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section className="github-dashboard" id="github">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="github-bx">
              <h2>
                GitHub Portfolio
                <span className="live-data-badge">
                  <i className="fas fa-satellite-dish"></i> Live Updates
                </span>
              </h2>
              <div className="email-service-indicator">
                <i className="fas fa-envelope"></i> EmailJS Integration Active
              </div>
              <p>
                Explore my coding journey through repositories, contributions,
                and development activity. Data fetched in real-time via GitHub API.
              </p>

              {/* Repositories and Contribution Graph Side by Side */}
              <Row>
                {/* Top Repositories - Left Half */}
                <Col lg={6}>
                  <Card className="github-section-card">
                    <Card.Header>
                      <h4>Top Repositories</h4>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {githubData.repos.slice(0, 4).map((repo, index) => (
                          <Col md={12} key={index} className="mb-3">
                            <div
                              className="repo-item"
                              onClick={() =>
                                window.open(repo.html_url, "_blank")
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <div className="repo-header">
                                <h5>
                                  <span className="repo-name">{repo.name}</span>
                                </h5>
                                <div className="repo-stats">
                                  <Badge variant="outline-primary">
                                    ⭐ {repo.stargazers_count}
                                  </Badge>
                                  <Badge variant="outline-secondary">
                                    🍴 {repo.forks_count}
                                  </Badge>
                                </div>
                              </div>
                              <p className="repo-description">
                                {repo.description}
                              </p>
                              <div className="repo-meta">
                                {repo.language && (
                                  <span className="repo-language">
                                    <span
                                      className="language-color"
                                      style={{
                                        backgroundColor: getLanguageColor(
                                          repo.language,
                                        ),
                                      }}
                                    ></span>
                                    {repo.language}
                                  </span>
                                )}
                                <span className="repo-updated">
                                  Updated {formatDate(repo.updated_at)}
                                </span>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Contribution Graph - Right Half */}
                <Col lg={6}>
                  <Card className="github-section-card">
                    <Card.Header>
                      <h4>Contribution Graph</h4>
                    </Card.Header>
                    <Card.Body>
                      <div className="contribution-graph-vertical">
                        <img
                          src={`https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=true&theme=dark&hide_border=true&bg_color=0D1117&title_color=F85D7F&icon_color=F85D7F&text_color=FFFFFF`}
                          alt="GitHub Stats"
                          className="github-stats-img-vertical"
                        />
                        <img
                          src={`https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}&theme=dark&hide_border=true&background=0D1117&stroke=F85D7F&ring=F85D7F&fire=F85D7F&currStreakLabel=FFFFFF`}
                          alt="GitHub Streak"
                          className="github-streak-img-vertical"
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};