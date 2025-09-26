import os
import sys
import fnmatch
import json

def load_ignore_patterns(gitignore_path):
    """
    Load ignore patterns from a .gitignore file.
    Returns a list of patterns (strings).
    """
    patterns = []
    if os.path.isfile(gitignore_path):
        with open(gitignore_path, "r") as f:
            for line in f:
                line = line.strip()
                # Ignore comments and empty lines
                if not line or line.startswith("#"):
                    continue
                patterns.append(line)
    return patterns

def is_ignored(relative_path, ignore_patterns):
    """
    Check if a file/directory should be ignored based on .gitignore patterns.
    
    We do a fnmatch check against:
      - the entire relative path (e.g. 'dist/some-file.js')
      - just the basename (e.g. 'some-file.js')
    """
    base = os.path.basename(relative_path)
    for pattern in ignore_patterns:
        # If the pattern matches the entire relative path or the basename
        if fnmatch.fnmatch(relative_path, pattern) or fnmatch.fnmatch(base, pattern):
            return True
    return False

def count_lines_in_file(file_path):
    """
    Safely count the number of lines in a file.
    Returns the line count as an integer.
    If the file cannot be read, returns None.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return sum(1 for _ in f)
    except:
        return None  # Could be a binary file or unreadable

def show_structure(start_path=".", prefix="", ignore_patterns=None, root_path=None, lines=None):
    """
    Recursively build and print a tree-like structure of directories/files,
    skipping items in .gitignore, BUT still printing 'node_modules'
    by name (without listing its contents).

    Also skips the .git folder completely.
    """
    if lines is None:
        lines = []

    if root_path is None:
        # The first call sets the "root" for relative paths
        root_path = os.path.abspath(start_path)

    try:
        entries = os.listdir(start_path)
    except PermissionError:
        # If we can't access the directory, skip it
        return lines

    entries.sort()  # Sort alphabetically for consistent output
    pointers = ["├── "] * (len(entries) - 1) + ["└── "] if entries else []

    for pointer, entry in zip(pointers, entries):
        full_path = os.path.join(start_path, entry)
        rel_path = os.path.relpath(full_path, root_path)

        # Special case for node_modules: show it but don't recurse
        if entry == "node_modules":
            line = prefix + pointer + entry
            print(line)        
            lines.append(line)
            continue
        
        # Skip .git and .next
        if entry == ".git":
            continue
        if entry == ".next":
            continue

        # If the file/directory is matched by .gitignore, skip it
        if is_ignored(rel_path, ignore_patterns):
            continue

        # If it's a directory, we display it and recurse without a line count
        if os.path.isdir(full_path):
            line = prefix + pointer + entry
            print(line)
            lines.append(line)

            extension = "│   " if pointer == "├── " else "    "
            show_structure(
                start_path=full_path,
                prefix=prefix + extension,
                ignore_patterns=ignore_patterns,
                root_path=root_path,
                lines=lines
            )
        else:
            # It's a file, so count lines
            line_count = count_lines_in_file(full_path)
            if line_count is not None:
                line = f"{prefix}{pointer}{entry} ({line_count} lines)"
            else:
                line = f"{prefix}{pointer}{entry} (unreadable)"

            print(line)
            lines.append(line)

    return lines

if __name__ == "__main__":
    # Get the target path from command line or default to current directory
    target_path = sys.argv[1] if len(sys.argv) > 1 else "."

    # Load .gitignore patterns from the target directory (if .gitignore exists)
    gitignore_file = os.path.join(target_path, ".gitignore")
    ignore_patterns = load_ignore_patterns(gitignore_file)

    # Build and print the directory structure; collect lines in a list
    lines = show_structure(start_path=target_path, ignore_patterns=ignore_patterns)

    # Write lines to a .txt file
    with open("structure.txt", "w", encoding="utf-8") as txt_file:
        for line in lines:
            txt_file.write(line + "\n")

    # Dump lines to a .json file (as a list of strings)
    with open("structure.json", "w", encoding="utf-8") as json_file:
        json.dump(lines, json_file, indent=2)
