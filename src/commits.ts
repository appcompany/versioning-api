import { getInput } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { Commit } from './commit';

/**
 * Get commits from commit sha on
 * @param {string} track name of track
 * @param {string} commitSha sha for commit
 */
export async function commitsFrom(
  track: string,
  commitSha: string
): Promise<Commit[]> {
  const github = getOctokit(getInput('token') || 'test');
  const list = (await github.rest.repos
    .listCommits({ ...context.repo, per_page: 100, sha: track })).data;

  const commits : Commit[] = [];
  for (const commit of list) {
    if (commit.sha == commitSha) break;
    commits.push({
      ref: commit.sha,
      message: commit.commit.message,
    });
  }
  return commits;
}