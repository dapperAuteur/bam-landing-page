<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Made a Django Secret Key and Did Not Know Where to Put It
Slug:    where-the-django-secret-key-goes
Excerpt: The deploy task for Invest.WitUS said to generate a secret key. I ran the command, a
         random string printed, and I had no idea where it went. The first Vercel build failed
         the way the task said it would, with the fix in the error message. What the task
         should have said, and why every step of this build gets a post.
Tags:    Python, Django, Vercel, Learning in Public, Operator Tasks, Invest.WitUS
-->

# I Made a Django Secret Key and Did Not Know Where to Put It

Invest.WitUS is the Django app I am building to learn Python. [I wrote about the setup](/blog/learning-python-by-building-the-app-i-need): Claude writes the chapters, and I follow them in my own copy. Chapter 06 made the app deployable to Vercel, and it came with an operator task for me: create the Vercel project, attach the database, set three environment variables, press Deploy. This post is about the ten minutes where I did what the task said and still could not finish it.

## I had the value and lost the name

The task listed the variables in a table. One row was `DJANGO_SECRET_KEY`, value "generated, see below." A few lines under the table it gave the command:

```sh
uv run python -c "from django.core.management.utils import get_random_secret_key as k; print(k())"
```

I ran it. A long random string printed. Then I stopped, because I did not know what to do with the string. The name was in the table above, the value was in my terminal below, and nothing between the two said "this is the value for `DJANGO_SECRET_KEY`." By the time the command finished, the table was gone from my head.

I had already pressed Deploy. The first build failed with a line my own settings file wrote:

```text
django.core.exceptions.ImproperlyConfigured: DJANGO_SECRET_KEY is not set and DJANGO_DEBUG is not 1. A server needs a secret key. Make one with: uv run python -c "from django.core.management.utils import get_random_secret_key as k; print(k())"
```

The task had predicted this, in a parenthesis I read and did not act on: set the variables before pressing Deploy, or the first build fails with `DJANGO_SECRET_KEY is not set`, which is the settings file's guard working.

## Why the build failed, not the server

I expected a missing secret to break the running site. It broke the build, and Vercel's Django docs say why: "When your Django project has `STATIC_ROOT` configured, Vercel automatically runs `collectstatic` during the build" (Vercel, 2026a). `collectstatic` loads the settings module, and the settings module is where the guard lives. The build died on the first import of settings. That is the better place to fail: a red build log with the fix printed in it, instead of a server that dies on its first request.

## The guard is the point

The settings file has a small function. If `DJANGO_SECRET_KEY` is set, use it. If it is not set and debug is on, use a labeled dev-only key with a `django-insecure-` prefix, which Django's deployment check flags. If it is not set and debug is off, refuse to start and say how to make one.

Vercel's Django example is gentler. It reads the same variable and falls back to a string ending in `change-me-in-production` (Vercel, n.d.). That server starts, signs every session with a value sitting in a public repository, and tells no one. Django's documentation says what that costs: "Running Django with a known SECRET_KEY defeats many of Django's security protections, and can lead to privilege escalation and remote code execution vulnerabilities" (Django Software Foundation, n.d.-a). One failed build is the cheap failure.

## Where the string goes

The printed string is the value of an environment variable named `DJANGO_SECRET_KEY`. In the Vercel dashboard: the project, Settings, Environment Variables, Add. Name `DJANGO_SECRET_KEY`, the string as the value, type Secret, environment Production. The type matters: "Config values remain readable to members with project access, while Secret values are write-only after saving" (Vercel, 2026b). Run the command again and add the second, different value for Preview. Then redeploy, because "Any change you make to environment variables are not applied to previous deployments, they only apply to new deployments" (Vercel, 2026b).

The rules I am keeping:

- One key per environment. Django's deployment checklist: "Make sure that the key used in production isn't used anywhere else and avoid committing it to source control" (Django Software Foundation, n.d.-b).
- The value never goes in git, in a chat window, or in a post like this one. The repo's `.env.example` lists the name with nothing after the equals sign.
- If I lose it, I make a new one. Rotating the key signs everyone out of the admin and touches no password: "key rotation will not affect them" (Django Software Foundation, n.d.-a).

## What the task should have said

The task named the dashboard, the menu, the field and the environments. It still lost me, because the command that printed the secret did not say what the secret was for. The fix is one sentence next to the command: this prints the value for `DJANGO_SECRET_KEY`; paste it into the Vercel project's Settings, Environment Variables, for Production. A command that prints a secret should say in the same breath where the secret goes. That is now the rule for every operator task written for this project.

## Why every step gets a post

I asked for a post about every step of this build, and this is why. The message was good and the task was mostly good. I still sat with a random string and no idea what to do with it, and that confusion is the useful part. The second time I set this variable I will not be confused, which means the person who can describe the gap honestly exists for about one afternoon. After that I will say the task was clear, because for me it will be.

## References

Django Software Foundation. (n.d.-a). *Settings*. Django documentation (Version 6.1). Retrieved October 28, 2026, from https://docs.djangoproject.com/en/6.1/ref/settings/#secret-key

Django Software Foundation. (n.d.-b). *Deployment checklist*. Django documentation (Version 6.1). Retrieved October 28, 2026, from https://docs.djangoproject.com/en/6.1/howto/deployment/checklist/

Vercel. (2026a, July 24). *Deploy a Django app on Vercel*. Vercel documentation. https://vercel.com/docs/frameworks/full-stack/django

Vercel. (2026b, September 17). *Environment variables*. Vercel documentation. https://vercel.com/docs/environment-variables

Vercel. (n.d.). *config/settings.py* [Source code]. In *vercel/examples* (python/django). GitHub. Retrieved October 28, 2026, from https://raw.githubusercontent.com/vercel/examples/main/python/django/config/settings.py
